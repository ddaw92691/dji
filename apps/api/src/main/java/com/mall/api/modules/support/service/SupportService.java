package com.mall.api.modules.support.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.modules.log.annotation.Audit;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.notification.NotificationService;
import com.mall.api.modules.realtime.RealtimeService;
import com.mall.api.modules.order.entity.MallOrder;
import com.mall.api.modules.order.mapper.MallOrderMapper;
import com.mall.api.modules.product.entity.Product;
import com.mall.api.modules.product.mapper.ProductMapper;
import com.mall.api.modules.support.entity.*;
import com.mall.api.modules.support.mapper.*;
import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class SupportService {

    private final SupportSessionMapper sessionMapper;
    private final SupportMessageMapper messageMapper;
    private final SupportReadStateMapper readStateMapper;
    private final SupportInspectionLogMapper inspectionLogMapper;
    private final UserMapper userMapper;
    private final MerchantMapper merchantMapper;
    private final ProductMapper productMapper;
    private final MallOrderMapper orderMapper;
    private final NotificationService notificationService;
    private final RealtimeService realtimeService;

    public SupportService(SupportSessionMapper sessionMapper,
                          SupportMessageMapper messageMapper,
                          SupportReadStateMapper readStateMapper,
                          SupportInspectionLogMapper inspectionLogMapper,
                          UserMapper userMapper,
                          MerchantMapper merchantMapper,
                          ProductMapper productMapper,
                          MallOrderMapper orderMapper,
                          NotificationService notificationService,
                          RealtimeService realtimeService) {
        this.sessionMapper = sessionMapper;
        this.messageMapper = messageMapper;
        this.readStateMapper = readStateMapper;
        this.inspectionLogMapper = inspectionLogMapper;
        this.userMapper = userMapper;
        this.merchantMapper = merchantMapper;
        this.productMapper = productMapper;
        this.orderMapper = orderMapper;
        this.notificationService = notificationService;
        this.realtimeService = realtimeService;
    }

    private String defaultSessionTitle(String sessionType) {
        if ("MERCHANT_TO_PLATFORM".equals(sessionType)) {
            return "Platform Support";
        }
        if ("ADMIN_INSPECTION_TO_MERCHANT".equals(sessionType)) {
            return "Inspection Session";
        }
        return "Customer Support";
    }

    @Transactional
    @Audit(module = "客服管理", action = "创建会话", description = "创建客服会话")
    public SupportSession createSession(String sessionType, String title, Long customerUserId,
                                         Long merchantId, Long merchantUserId, String priority,
                                         Long productId, Long orderId) {
        if (sessionType == null || sessionType.isBlank()) {
            throw new BusinessException(400, "会话类型不能为空");
        }

        SupportSession session = new SupportSession();
        session.setSessionNo("SES" + System.currentTimeMillis() + String.format("%04d", new Random().nextInt(10000)));
        session.setSessionType(sessionType);
        session.setTitle(title != null && !title.isBlank() ? title : defaultSessionTitle(sessionType));
        session.setStatus("OPEN");
        session.setPriority(priority != null ? priority : "NORMAL");
        session.setCustomerUserId(customerUserId);
        session.setMerchantId(merchantId);
        session.setMerchantUserId(merchantUserId);
        session.setRelatedProductId(productId);
        session.setRelatedOrderId(orderId);
        session.setUnreadCustomerCount(0);
        session.setUnreadMerchantCount(0);
        session.setUnreadAdminCount(0);
        session.setDeleted(false);
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());
        sessionMapper.insert(session);

        if ("CUSTOMER_TO_MERCHANT".equals(sessionType) && merchantUserId != null) {
            notificationService.createNotification(merchantUserId, "MERCHANT",
                    "新しいカスタマーサポートセッション", "顧客が新しいサポートセッションを作成しました。セッション番号: " + session.getSessionNo(),
                    "SUPPORT", "support_session", session.getId());
        } else if ("MERCHANT_TO_PLATFORM".equals(sessionType)) {
            List<User> admins = userMapper.selectList(Wrappers.<User>lambdaQuery()
                    .in(User::getRole, "SUPER_ADMIN", "ADMIN")
                    .eq(User::getStatus, 1));
            for (User admin : admins) {
                notificationService.createNotification(admin.getId(), admin.getRole(),
                        "新しいプラットフォームサポートセッション",
                        "マーチャントがプラットフォームサポートセッションを作成しました。セッション番号: " + session.getSessionNo(),
                        "SUPPORT", "support_session", session.getId());
            }
        }

        return session;
    }

    public Map<String, Object> getSessionDetail(Long sessionId, String userRole, Long userId) {
        SupportSession session = sessionMapper.selectById(sessionId);
        if (session == null) {
            throw new BusinessException(404, "会话不存在");
        }

        validateAccess(session, userRole, userId);

        List<SupportMessage> messages = messageMapper.selectList(Wrappers.<SupportMessage>lambdaQuery()
                .eq(SupportMessage::getSessionId, sessionId)
                .orderByAsc(SupportMessage::getCreatedAt));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("session", buildSessionVO(session, userRole, userId));
        result.put("messages", messages);
        return result;
    }

    public Map<String, Object> getCustomerSessions(Long userId, String status, int page, int pageSize) {
        LambdaQueryWrapper<SupportSession> wrapper = Wrappers.<SupportSession>lambdaQuery()
                .eq(SupportSession::getCustomerUserId, userId)
                .eq(status != null && !status.isBlank(), SupportSession::getStatus, status)
                .orderByDesc(SupportSession::getUpdatedAt);

        Page<SupportSession> pg = sessionMapper.selectPage(new Page<>(page, pageSize), wrapper);

        List<Map<String, Object>> list = new ArrayList<>();
        for (SupportSession s : pg.getRecords()) {
            list.add(buildSessionVO(s, "CUSTOMER", userId));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("list", list);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public Map<String, Object> getMerchantCustomerSessions(Long merchantId, String status, String keyword,
                                                            int page, int pageSize) {
        LambdaQueryWrapper<SupportSession> wrapper = Wrappers.<SupportSession>lambdaQuery()
                .eq(SupportSession::getMerchantId, merchantId)
                .in(SupportSession::getSessionType, "CUSTOMER_TO_MERCHANT", "ADMIN_INSPECTION_TO_MERCHANT")
                .eq(status != null && !status.isBlank(), SupportSession::getStatus, status)
                .orderByDesc(SupportSession::getUpdatedAt);

        Page<SupportSession> pg = sessionMapper.selectPage(new Page<>(page, pageSize), wrapper);

        List<Map<String, Object>> list = new ArrayList<>();
        for (SupportSession s : pg.getRecords()) {
            Map<String, Object> vo = buildSessionVO(s, "MERCHANT", merchantId);
            if ("ADMIN_INSPECTION_TO_MERCHANT".equals(s.getSessionType())) {
                SupportInspectionLog log = inspectionLogMapper.selectOne(Wrappers.<SupportInspectionLog>lambdaQuery()
                        .eq(SupportInspectionLog::getSessionId, s.getId()));
                if (log != null) {
                    vo.put("displayCustomerName", log.getFakeCustomerName() != null ?
                            log.getFakeCustomerName() : "Guest Customer");
                    vo.put("fakeCustomerName", log.getFakeCustomerName());
                    vo.put("question", log.getQuestion());
                    vo.put("inspectionStatus", log.getStatus());
                }
            }
            if (keyword != null && !keyword.isBlank()) {
                String sn = s.getSessionNo() != null ? s.getSessionNo().toLowerCase() : "";
                String lm = s.getLastMessage() != null ? s.getLastMessage().toLowerCase() : "";
                String kw = keyword.toLowerCase();
                if (!sn.contains(kw) && !lm.contains(kw)) {
                    continue;
                }
            }
            list.add(vo);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("list", list);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public Map<String, Object> getPlatformSessions(Long merchantUserId, String status, int page, int pageSize) {
        LambdaQueryWrapper<SupportSession> wrapper = Wrappers.<SupportSession>lambdaQuery()
                .eq(SupportSession::getSessionType, "MERCHANT_TO_PLATFORM")
                .eq(SupportSession::getMerchantUserId, merchantUserId)
                .eq(status != null && !status.isBlank(), SupportSession::getStatus, status)
                .orderByDesc(SupportSession::getUpdatedAt);

        Page<SupportSession> pg = sessionMapper.selectPage(new Page<>(page, pageSize), wrapper);

        List<Map<String, Object>> list = new ArrayList<>();
        for (SupportSession s : pg.getRecords()) {
            list.add(buildSessionVO(s, "MERCHANT", merchantUserId));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("list", list);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public Map<String, Object> getAdminCustomerMerchantSessions(String status, String keyword,
                                                                  Long merchantId, int page, int pageSize) {
        LambdaQueryWrapper<SupportSession> wrapper = Wrappers.<SupportSession>lambdaQuery()
                .eq(SupportSession::getSessionType, "CUSTOMER_TO_MERCHANT")
                .eq(status != null && !status.isBlank(), SupportSession::getStatus, status)
                .eq(merchantId != null, SupportSession::getMerchantId, merchantId)
                .orderByDesc(SupportSession::getUpdatedAt);

        Page<SupportSession> pg = sessionMapper.selectPage(new Page<>(page, pageSize), wrapper);

        List<Map<String, Object>> list = new ArrayList<>();
        for (SupportSession s : pg.getRecords()) {
            if (keyword != null && !keyword.isBlank()) {
                String sn = s.getSessionNo() != null ? s.getSessionNo().toLowerCase() : "";
                String lm = s.getLastMessage() != null ? s.getLastMessage().toLowerCase() : "";
                String kw = keyword.toLowerCase();
                if (!sn.contains(kw) && !lm.contains(kw)) {
                    continue;
                }
            }
            list.add(buildSessionVO(s, "ADMIN", null));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("list", list);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public Map<String, Object> getAdminPlatformSessions(String status, int page, int pageSize) {
        LambdaQueryWrapper<SupportSession> wrapper = Wrappers.<SupportSession>lambdaQuery()
                .eq(SupportSession::getSessionType, "MERCHANT_TO_PLATFORM")
                .eq(status != null && !status.isBlank(), SupportSession::getStatus, status)
                .orderByDesc(SupportSession::getUpdatedAt);

        Page<SupportSession> pg = sessionMapper.selectPage(new Page<>(page, pageSize), wrapper);

        List<Map<String, Object>> list = new ArrayList<>();
        for (SupportSession s : pg.getRecords()) {
            Map<String, Object> vo = buildSessionVO(s, "ADMIN", null);
            SupportInspectionLog log = inspectionLogMapper.selectOne(Wrappers.<SupportInspectionLog>lambdaQuery()
                    .eq(SupportInspectionLog::getSessionId, s.getId()));
            if (log != null) {
                vo.put("fakeCustomerName", log.getFakeCustomerName());
                vo.put("question", log.getQuestion());
                vo.put("inspectionStatus", log.getStatus());
            }
            list.add(vo);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("list", list);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public Map<String, Object> getAdminInspectionSessions(String status, Long merchantId, int page, int pageSize) {
        LambdaQueryWrapper<SupportSession> wrapper = Wrappers.<SupportSession>lambdaQuery()
                .eq(SupportSession::getSessionType, "ADMIN_INSPECTION_TO_MERCHANT")
                .eq(status != null && !status.isBlank(), SupportSession::getStatus, status)
                .eq(merchantId != null, SupportSession::getMerchantId, merchantId)
                .orderByDesc(SupportSession::getUpdatedAt);

        Page<SupportSession> pg = sessionMapper.selectPage(new Page<>(page, pageSize), wrapper);

        List<Map<String, Object>> list = new ArrayList<>();
        for (SupportSession s : pg.getRecords()) {
            list.add(buildSessionVO(s, "ADMIN", null));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("list", list);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    @Transactional
    @Audit(module = "客服管理", action = "关闭会话", description = "关闭客服会话")
    public void closeSession(Long sessionId, String userRole, Long userId, String closeReason) {
        SupportSession session = sessionMapper.selectById(sessionId);
        if (session == null) {
            throw new BusinessException(404, "会话不存在");
        }

        if (!"OPEN".equals(session.getStatus()) && !"PENDING".equals(session.getStatus())) {
            throw new BusinessException(400, "只能关闭进行中的会话");
        }

        validateAccess(session, userRole, userId);

        session.setStatus("CLOSED");
        session.setClosedAt(LocalDateTime.now());
        session.setCloseReason(closeReason);
        session.setUpdatedAt(LocalDateTime.now());
        sessionMapper.updateById(session);
    }

    @Transactional
    public SupportMessage sendMessage(Long sessionId, Long senderUserId, String senderRole,
                                       String senderDisplayName, String senderAvatar, String senderSide,
                                       String content, String messageType, String attachments) {
        SupportSession session = sessionMapper.selectById(sessionId);
        if (session == null) {
            throw new BusinessException(404, "会话不存在");
        }

        if (!"OPEN".equals(session.getStatus()) && !"PENDING".equals(session.getStatus())) {
            throw new BusinessException(400, "会话已关闭，无法发送消息");
        }

        SupportMessage message = new SupportMessage();
        message.setSessionId(sessionId);
        message.setSenderUserId(senderUserId);
        message.setSenderRole(senderRole);
        message.setSenderDisplayName(senderDisplayName);
        message.setSenderAvatar(senderAvatar);
        message.setSenderSide(senderSide);
        message.setContent(content);
        message.setMessageType(messageType != null ? messageType : "TEXT");
        message.setAttachments(attachments);
        message.setCreatedAt(LocalDateTime.now());
        message.setUpdatedAt(LocalDateTime.now());
        messageMapper.insert(message);

        session.setLastMessage(content);
        session.setLastMessageAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());

        incrementUnreadCounts(session, senderSide);

        if ("ADMIN_INSPECTION_TO_MERCHANT".equals(session.getSessionType())) {
            if ("MERCHANT".equals(senderSide) && session.getFirstResponseAt() == null) {
                session.setFirstResponseAt(LocalDateTime.now());
            }
        }

        sessionMapper.updateById(session);

        sendMessageNotifications(session, senderSide);

        Map<String, Object> eventPayload = new HashMap<>();
        eventPayload.put("sessionId", sessionId);
        eventPayload.put("messageId", message.getId());
        eventPayload.put("senderSide", senderSide);
        eventPayload.put("content", content);

        if ("CUSTOMER_TO_MERCHANT".equals(session.getSessionType())) {
            if ("CUSTOMER".equals(senderSide) && session.getMerchantUserId() != null) {
                realtimeService.sendToUser(session.getMerchantUserId(),
                        RealtimeService.RealtimeEvent.of("SUPPORT_MESSAGE_CREATED", "support_message",
                                message.getId(), "新客服消息", content, eventPayload));
            } else if ("MERCHANT".equals(senderSide) && session.getCustomerUserId() != null) {
                realtimeService.sendToUser(session.getCustomerUserId(),
                        RealtimeService.RealtimeEvent.of("SUPPORT_MESSAGE_CREATED", "support_message",
                                message.getId(), "新客服消息", content, eventPayload));
            }
        } else if ("MERCHANT_TO_PLATFORM".equals(session.getSessionType())) {
            if ("MERCHANT".equals(senderSide)) {
                realtimeService.sendToRole("ADMIN",
                        RealtimeService.RealtimeEvent.of("SUPPORT_MESSAGE_CREATED", "support_message",
                                message.getId(), "新平台支持消息", content, eventPayload));
            } else if ("ADMIN".equals(senderSide) && session.getMerchantUserId() != null) {
                realtimeService.sendToUser(session.getMerchantUserId(),
                        RealtimeService.RealtimeEvent.of("SUPPORT_MESSAGE_CREATED", "support_message",
                                message.getId(), "新平台支持回复", content, eventPayload));
            }
        } else if ("ADMIN_INSPECTION_TO_MERCHANT".equals(session.getSessionType())) {
            if ("MERCHANT".equals(senderSide) && session.getInspectionOperatorId() != null) {
                realtimeService.sendToUser(session.getInspectionOperatorId(),
                        RealtimeService.RealtimeEvent.of("SUPPORT_MESSAGE_CREATED", "support_message",
                                message.getId(), "新巡检回复", content, eventPayload));
            }
        }

        return message;
    }

    public List<SupportMessage> getMessages(Long sessionId, String userRole, Long userId) {
        SupportSession session = sessionMapper.selectById(sessionId);
        if (session == null) {
            throw new BusinessException(404, "会话不存在");
        }

        validateAccess(session, userRole, userId);

        return messageMapper.selectList(Wrappers.<SupportMessage>lambdaQuery()
                .eq(SupportMessage::getSessionId, sessionId)
                .orderByAsc(SupportMessage::getCreatedAt));
    }

    @Transactional
    public void markAsRead(Long sessionId, Long userId) {
        SupportSession session = sessionMapper.selectById(sessionId);
        if (session == null) {
            throw new BusinessException(404, "会话不存在");
        }

        List<SupportMessage> messages = messageMapper.selectList(Wrappers.<SupportMessage>lambdaQuery()
                .eq(SupportMessage::getSessionId, sessionId)
                .orderByDesc(SupportMessage::getCreatedAt));

        Long lastMessageId = messages.isEmpty() ? null : messages.get(0).getId();

        SupportReadState readState = readStateMapper.selectOne(Wrappers.<SupportReadState>lambdaQuery()
                .eq(SupportReadState::getSessionId, sessionId)
                .eq(SupportReadState::getUserId, userId));

        if (readState == null) {
            readState = new SupportReadState();
            readState.setSessionId(sessionId);
            readState.setUserId(userId);
            readState.setLastReadMessageId(lastMessageId);
            readState.setUnreadCount(0);
            readState.setCreatedAt(LocalDateTime.now());
            readState.setUpdatedAt(LocalDateTime.now());
            readStateMapper.insert(readState);
        } else {
            readState.setLastReadMessageId(lastMessageId);
            readState.setUnreadCount(0);
            readState.setUpdatedAt(LocalDateTime.now());
            readStateMapper.updateById(readState);
        }

        LambdaUpdateWrapper<SupportSession> updateWrapper = Wrappers.<SupportSession>lambdaUpdate()
                .eq(SupportSession::getId, sessionId);
        User user = userMapper.selectById(userId);
        if (user != null) {
            if ("CUSTOMER".equals(user.getRole())) {
                updateWrapper.set(SupportSession::getUnreadCustomerCount, 0);
            } else if ("MERCHANT".equals(user.getRole()) || "AGENT".equals(user.getRole())) {
                updateWrapper.set(SupportSession::getUnreadMerchantCount, 0);
            } else if ("SUPER_ADMIN".equals(user.getRole()) || "ADMIN".equals(user.getRole())) {
                updateWrapper.set(SupportSession::getUnreadAdminCount, 0);
            }
        }
        sessionMapper.update(null, updateWrapper);
    }

    @Transactional
    @Audit(module = "客服管理", action = "创建巡检", description = "创建巡检会话")
    public SupportSession createInspectionSession(Long operatorUserId, String fakeCustomerName, String title,
                                                    Long inspectionCustomerUserId, Long merchantId,
                                                    String question, Long relatedProductId,
                                                    Long relatedOrderId) {
        SupportSession session = new SupportSession();
        session.setSessionNo("INS" + System.currentTimeMillis() + String.format("%04d", new Random().nextInt(10000)));
        session.setSessionType("ADMIN_INSPECTION_TO_MERCHANT");
        session.setTitle(title != null && !title.isBlank() ? title : "Inspection Session");
        session.setStatus("OPEN");
        session.setPriority("NORMAL");
        session.setInspectionOperatorId(operatorUserId);
        session.setInspectionCustomerUserId(inspectionCustomerUserId);
        session.setCustomerUserId(inspectionCustomerUserId);
        session.setMerchantId(merchantId);
        session.setRelatedProductId(relatedProductId);
        session.setRelatedOrderId(relatedOrderId);
        session.setUnreadCustomerCount(0);
        session.setUnreadMerchantCount(0);
        session.setUnreadAdminCount(0);
        session.setDeleted(false);
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());
        sessionMapper.insert(session);

        String displayName = fakeCustomerName;
        if (displayName == null || displayName.isBlank()) {
            if (inspectionCustomerUserId != null) {
                User customer = userMapper.selectById(inspectionCustomerUserId);
                if (customer != null && customer.getNickname() != null) {
                    displayName = customer.getNickname();
                }
            }
        }
        if (displayName == null || displayName.isBlank()) {
            displayName = "Guest Customer";
        }

        SupportMessage message = new SupportMessage();
        message.setSessionId(session.getId());
        message.setSenderUserId(operatorUserId);
        message.setSenderRole("INSPECTION_CUSTOMER");
        message.setSenderDisplayName(displayName);
        message.setSenderAvatar(null);
        message.setSenderSide("CUSTOMER");
        message.setContent(question);
        message.setMessageType("TEXT");
        message.setAttachments(null);
        message.setCreatedAt(LocalDateTime.now());
        message.setUpdatedAt(LocalDateTime.now());
        messageMapper.insert(message);

        session.setLastMessage(question);
        session.setLastMessageAt(LocalDateTime.now());
        session.setUnreadMerchantCount(1);
        session.setUpdatedAt(LocalDateTime.now());
        sessionMapper.updateById(session);

        SupportInspectionLog log = new SupportInspectionLog();
        log.setSessionId(session.getId());
        log.setMerchantId(merchantId);
        log.setOperatorUserId(operatorUserId);
        log.setFakeCustomerName(fakeCustomerName);
        log.setQuestion(question);
        log.setStatus("RUNNING");
        log.setCreatedAt(LocalDateTime.now());
        log.setUpdatedAt(LocalDateTime.now());
        inspectionLogMapper.insert(log);

        Merchant merchant = merchantMapper.selectById(merchantId);
        if (merchant != null && merchant.getUserId() != null) {
            notificationService.createNotification(merchant.getUserId(), "MERCHANT",
                    "新しい顧客問い合わせ",
                    "顧客 " + displayName + " から新しい問い合わせがあります: " + question,
                    "SUPPORT", "support_session", session.getId());
        }

        return session;
    }

    @Transactional
    @Audit(module = "客服管理", action = "巡检评分", description = "对巡检会话进行评分")
    public void scoreInspection(Long sessionId, Integer qualityScore, String qualityRemark) {
        SupportSession session = sessionMapper.selectById(sessionId);
        if (session == null) {
            throw new BusinessException(404, "会话不存在");
        }

        if (!"ADMIN_INSPECTION_TO_MERCHANT".equals(session.getSessionType())) {
            throw new BusinessException(400, "只能对巡检会话进行评分");
        }

        session.setQualityScore(qualityScore);
        session.setQualityRemark(qualityRemark);
        session.setUpdatedAt(LocalDateTime.now());
        sessionMapper.updateById(session);

        SupportInspectionLog log = inspectionLogMapper.selectOne(Wrappers.<SupportInspectionLog>lambdaQuery()
                .eq(SupportInspectionLog::getSessionId, sessionId));
        if (log != null) {
            log.setStatus("COMPLETED");
            log.setQualityScore(qualityScore);
            log.setQualityRemark(qualityRemark);

            if (session.getFirstResponseAt() != null && session.getCreatedAt() != null) {
                long seconds = ChronoUnit.SECONDS.between(session.getCreatedAt(), session.getFirstResponseAt());
                log.setFirstResponseSeconds((int) seconds);
            }

            log.setUpdatedAt(LocalDateTime.now());
            inspectionLogMapper.updateById(log);
        }

        closeSession(sessionId, "ADMIN", session.getInspectionOperatorId(), "巡检完成");
    }

    private void validateAccess(SupportSession session, String userRole, Long userId) {
        switch (userRole) {
            case "CUSTOMER":
                if (!userId.equals(session.getCustomerUserId())) {
                    throw new BusinessException(403, "无权访问此会话");
                }
                break;
            case "MERCHANT":
            case "AGENT":
                if (session.getMerchantUserId() != null && !userId.equals(session.getMerchantUserId())) {
                    Merchant merchant = merchantMapper.selectById(session.getMerchantId());
                    if (merchant == null || !userId.equals(merchant.getUserId())) {
                        throw new BusinessException(403, "无权访问此会话");
                    }
                }
                break;
            case "SUPER_ADMIN":
            case "ADMIN":
                break;
            default:
                throw new BusinessException(403, "无权访问此会话");
        }
    }

    private void incrementUnreadCounts(SupportSession session, String senderSide) {
        switch (senderSide) {
            case "CUSTOMER":
                if (session.getUnreadMerchantCount() != null) {
                    session.setUnreadMerchantCount(session.getUnreadMerchantCount() + 1);
                } else {
                    session.setUnreadMerchantCount(1);
                }
                break;
            case "MERCHANT":
                if ("CUSTOMER_TO_MERCHANT".equals(session.getSessionType())) {
                    if (session.getUnreadCustomerCount() != null) {
                        session.setUnreadCustomerCount(session.getUnreadCustomerCount() + 1);
                    } else {
                        session.setUnreadCustomerCount(1);
                    }
                } else if ("MERCHANT_TO_PLATFORM".equals(session.getSessionType())) {
                    if (session.getUnreadAdminCount() != null) {
                        session.setUnreadAdminCount(session.getUnreadAdminCount() + 1);
                    } else {
                        session.setUnreadAdminCount(1);
                    }
                } else if ("ADMIN_INSPECTION_TO_MERCHANT".equals(session.getSessionType())) {
                    if (session.getUnreadAdminCount() != null) {
                        session.setUnreadAdminCount(session.getUnreadAdminCount() + 1);
                    } else {
                        session.setUnreadAdminCount(1);
                    }
                }
                break;
            case "ADMIN":
                if ("MERCHANT_TO_PLATFORM".equals(session.getSessionType())) {
                    if (session.getUnreadMerchantCount() != null) {
                        session.setUnreadMerchantCount(session.getUnreadMerchantCount() + 1);
                    } else {
                        session.setUnreadMerchantCount(1);
                    }
                } else if ("ADMIN_INSPECTION_TO_MERCHANT".equals(session.getSessionType())) {
                    if (session.getUnreadMerchantCount() != null) {
                        session.setUnreadMerchantCount(session.getUnreadMerchantCount() + 1);
                    } else {
                        session.setUnreadMerchantCount(1);
                    }
                }
                break;
            case "SYSTEM":
                break;
        }
    }

    private void sendMessageNotifications(SupportSession session, String senderSide) {
        if ("CUSTOMER_TO_MERCHANT".equals(session.getSessionType())) {
            if ("CUSTOMER".equals(senderSide) && session.getMerchantUserId() != null) {
                notificationService.createNotification(session.getMerchantUserId(), "MERCHANT",
                        "新着メッセージ", "顧客から新しいメッセージが届きました",
                        "SUPPORT", "support_session", session.getId());
            } else if ("MERCHANT".equals(senderSide) && session.getCustomerUserId() != null) {
                notificationService.createNotification(session.getCustomerUserId(), "CUSTOMER",
                        "新着メッセージ", "マーチャントから新しいメッセージが届きました",
                        "SUPPORT", "support_session", session.getId());
            }
        } else if ("MERCHANT_TO_PLATFORM".equals(session.getSessionType())) {
            if ("MERCHANT".equals(senderSide)) {
                List<User> admins = userMapper.selectList(Wrappers.<User>lambdaQuery()
                        .in(User::getRole, "SUPER_ADMIN", "ADMIN")
                        .eq(User::getStatus, 1));
                for (User admin : admins) {
                    notificationService.createNotification(admin.getId(), admin.getRole(),
                            "新着メッセージ", "マーチャントからプラットフォームサポートにメッセージが届きました",
                            "SUPPORT", "support_session", session.getId());
                }
            } else if ("ADMIN".equals(senderSide) && session.getMerchantUserId() != null) {
                notificationService.createNotification(session.getMerchantUserId(), "MERCHANT",
                        "新着メッセージ", "プラットフォームサポートから返信がありました",
                        "SUPPORT", "support_session", session.getId());
            }
        } else if ("ADMIN_INSPECTION_TO_MERCHANT".equals(session.getSessionType())) {
            if ("MERCHANT".equals(senderSide) && session.getInspectionOperatorId() != null) {
                notificationService.createNotification(session.getInspectionOperatorId(),
                        userMapper.selectById(session.getInspectionOperatorId()) != null ?
                                userMapper.selectById(session.getInspectionOperatorId()).getRole() : "ADMIN",
                        "新着メッセージ", "マーチャントが検査問い合わせに返信しました",
                        "SUPPORT", "support_session", session.getId());
            }
        }
    }

    private Map<String, Object> buildSessionVO(SupportSession session, String userRole, Long userId) {
        Map<String, Object> vo = new LinkedHashMap<>();
        vo.put("id", session.getId());
        vo.put("sessionId", session.getId());
        vo.put("sessionNo", session.getSessionNo());
        vo.put("sessionType", session.getSessionType());
        vo.put("title", session.getTitle());
        vo.put("status", session.getStatus());
        vo.put("priority", session.getPriority());
        vo.put("customerUserId", session.getCustomerUserId());
        vo.put("merchantId", session.getMerchantId());
        vo.put("merchantUserId", session.getMerchantUserId());
        vo.put("relatedProductId", session.getRelatedProductId());
        vo.put("relatedOrderId", session.getRelatedOrderId());
        vo.put("lastMessage", session.getLastMessage());
        vo.put("lastMessageAt", session.getLastMessageAt());
        vo.put("unreadCustomerCount", session.getUnreadCustomerCount());
        vo.put("unreadMerchantCount", session.getUnreadMerchantCount());
        vo.put("unreadAdminCount", session.getUnreadAdminCount());
        vo.put("customerUnread", session.getUnreadCustomerCount());
        vo.put("merchantUnread", session.getUnreadMerchantCount());
        vo.put("firstResponseAt", session.getFirstResponseAt());
        vo.put("closedAt", session.getClosedAt());
        vo.put("closeReason", session.getCloseReason());
        vo.put("createdAt", session.getCreatedAt());
        vo.put("updatedAt", session.getUpdatedAt());

        if ("CUSTOMER".equals(userRole) && userId != null) {
            vo.put("unreadCount", session.getUnreadCustomerCount());
        } else if (("MERCHANT".equals(userRole) || "AGENT".equals(userRole)) && userId != null) {
            vo.put("unreadCount", session.getUnreadMerchantCount());
        } else if (("SUPER_ADMIN".equals(userRole) || "ADMIN".equals(userRole)) && userId != null) {
            vo.put("unreadCount", session.getUnreadAdminCount());
        }

        if ("ADMIN".equals(userRole) || "SUPER_ADMIN".equals(userRole)) {
            vo.put("inspectionOperatorId", session.getInspectionOperatorId());
            vo.put("inspectionCustomerUserId", session.getInspectionCustomerUserId());
            vo.put("qualityScore", session.getQualityScore());
            vo.put("qualityRemark", session.getQualityRemark());
        }

        if (session.getCustomerUserId() != null) {
            User customer = userMapper.selectById(session.getCustomerUserId());
            if (customer != null) {
                Map<String, Object> customerInfo = new LinkedHashMap<>();
                customerInfo.put("id", customer.getId());
                customerInfo.put("nickname", customer.getNickname());
                customerInfo.put("avatar", customer.getAvatar());
                vo.put("customer", customerInfo);
                vo.put("customerName", customer.getNickname());
            }
        }

        if (session.getMerchantId() != null) {
            Merchant merchant = merchantMapper.selectById(session.getMerchantId());
            if (merchant != null) {
                Map<String, Object> merchantInfo = new LinkedHashMap<>();
                merchantInfo.put("id", merchant.getId());
                merchantInfo.put("shopName", merchant.getShopName());
                merchantInfo.put("shopLogo", merchant.getShopLogo());
                vo.put("merchant", merchantInfo);
                vo.put("merchantName", merchant.getShopName());
            }
        }

        return vo;
    }
}
