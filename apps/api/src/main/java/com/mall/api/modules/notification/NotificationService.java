package com.mall.api.modules.notification;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.notification.entity.Notification;
import com.mall.api.modules.notification.mapper.NotificationMapper;
import com.mall.api.modules.realtime.RealtimeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {

    private final NotificationMapper notificationMapper;
    private final RealtimeService realtimeService;
    private final MerchantMapper merchantMapper;

    public NotificationService(NotificationMapper notificationMapper, RealtimeService realtimeService,
                               MerchantMapper merchantMapper) {
        this.notificationMapper = notificationMapper;
        this.realtimeService = realtimeService;
        this.merchantMapper = merchantMapper;
    }

    @Transactional
    public Notification createNotification(Long userId, String role, String title, String content,
                                            String type, String bizType, Long bizId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setRole(role);
        notification.setTitle(title);
        notification.setContent(content);
        notification.setType(type);
        notification.setBizType(bizType);
        notification.setBizId(bizId);
        notification.setReadStatus("UNREAD");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setDeleted(false);
        notificationMapper.insert(notification);

        realtimeService.sendToUser(userId, RealtimeService.RealtimeEvent.of("NOTIFICATION_CREATED",
                "notification", notification.getId(), title, content,
                Map.of("type", type, "bizType", bizType, "bizId", bizId != null ? bizId : 0)));

        return notification;
    }

    @Transactional
    public Notification createMerchantNotification(Long merchantId, String title, String content,
                                                   String type, String bizType, Long bizId) {
        Merchant merchant = merchantMapper.selectById(merchantId);
        if (merchant == null || merchant.getUserId() == null || Boolean.TRUE.equals(merchant.getDeleted())) {
            return null;
        }
        return createNotification(merchant.getUserId(), "MERCHANT", title, content, type, bizType, bizId);
    }

    public Map<String, Object> getMyNotifications(Long userId, String readStatus, String type,
                                                    int page, int pageSize) {
        LambdaQueryWrapper<Notification> wrapper = Wrappers.<Notification>lambdaQuery()
                .eq(Notification::getUserId, userId)
                .eq(Notification::getDeleted, false)
                .eq(readStatus != null && !readStatus.isBlank(), Notification::getReadStatus, readStatus)
                .eq(type != null && !type.isBlank(), Notification::getType, type)
                .orderByDesc(Notification::getCreatedAt);
        Page<Notification> pg = notificationMapper.selectPage(new Page<>(page, pageSize), wrapper);

        Map<String, Object> result = new HashMap<>();
        result.put("list", pg.getRecords());
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public long getUnreadCount(Long userId) {
        LambdaQueryWrapper<Notification> wrapper = Wrappers.<Notification>lambdaQuery()
                .eq(Notification::getUserId, userId)
                .eq(Notification::getReadStatus, "UNREAD")
                .eq(Notification::getDeleted, false);
        return notificationMapper.selectCount(wrapper);
    }

    @Transactional
    public void markAsRead(Long userId, Long notificationId) {
        Notification notification = notificationMapper.selectById(notificationId);
        if (notification == null) {
            throw new BusinessException(400, "通知不存在");
        }
        if (!notification.getUserId().equals(userId)) {
            throw new BusinessException(400, "无权操作此通知");
        }
        notification.setReadStatus("READ");
        notification.setReadAt(LocalDateTime.now());
        notificationMapper.updateById(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        LambdaQueryWrapper<Notification> wrapper = Wrappers.<Notification>lambdaQuery()
                .eq(Notification::getUserId, userId)
                .eq(Notification::getReadStatus, "UNREAD")
                .eq(Notification::getDeleted, false);
        for (Notification notification : notificationMapper.selectList(wrapper)) {
            notification.setReadStatus("READ");
            notification.setReadAt(LocalDateTime.now());
            notificationMapper.updateById(notification);
        }
    }
}
