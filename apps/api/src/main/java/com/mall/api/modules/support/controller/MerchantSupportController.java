package com.mall.api.modules.support.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.support.dto.CloseSessionRequest;
import com.mall.api.modules.support.dto.CreateSessionRequest;
import com.mall.api.modules.support.dto.QuickReplyRequest;
import com.mall.api.modules.support.dto.SendMessageRequest;
import com.mall.api.modules.support.entity.SupportMessage;
import com.mall.api.modules.support.entity.SupportQuickReply;
import com.mall.api.modules.support.entity.SupportSession;
import com.mall.api.modules.support.service.SupportQuickReplyService;
import com.mall.api.modules.support.service.SupportService;
import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/merchant/support")
@Tag(name = "商家客服")
@PreAuthorize("hasAnyRole('MERCHANT','AGENT')")
public class MerchantSupportController {

    private final SupportService supportService;
    private final SupportQuickReplyService quickReplyService;
    private final UserMapper userMapper;
    private final MerchantMapper merchantMapper;

    public MerchantSupportController(SupportService supportService,
                                      SupportQuickReplyService quickReplyService,
                                      UserMapper userMapper,
                                      MerchantMapper merchantMapper) {
        this.supportService = supportService;
        this.quickReplyService = quickReplyService;
        this.userMapper = userMapper;
        this.merchantMapper = merchantMapper;
    }

    @GetMapping("/customer-sessions")
    @Operation(summary = "商家客户会话列表(CUSTOMER_TO_MERCHANT + ADMIN_INSPECTION_TO_MERCHANT)")
    public ApiResponse<Map<String, Object>> getCustomerSessions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long userId = SecurityUtils.getCurrentUserId();
        Merchant merchant = getMerchantByUserId(userId);
        if (merchant == null) {
            return ApiResponse.error(400, "商家信息不存在");
        }
        return ApiResponse.success(supportService.getMerchantCustomerSessions(
                merchant.getId(), status, keyword, page, pageSize));
    }

    @GetMapping("/customer-sessions/{id}")
    @Operation(summary = "客户会话详情(隐藏巡检字段)")
    public ApiResponse<Map<String, Object>> getCustomerSessionDetail(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        return ApiResponse.success(supportService.getSessionDetail(id,
                user != null ? user.getRole() : "MERCHANT", userId));
    }

    @PostMapping("/customer-sessions/{id}/messages")
    @Operation(summary = "回复客户消息(首次响应追踪)")
    public ApiResponse<SupportMessage> replyCustomerMessage(@PathVariable Long id,
                                                             @RequestBody SendMessageRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        Merchant merchant = getMerchantByUserId(userId);
        SupportMessage message = supportService.sendMessage(
                id,
                userId,
                user != null ? user.getRole() : "MERCHANT",
                merchant != null ? merchant.getShopName() : "Merchant",
                merchant != null ? merchant.getShopLogo() : null,
                "MERCHANT",
                request.getContent(),
                request.getMessageType(),
                request.getAttachments()
        );
        return ApiResponse.success(message);
    }

    @GetMapping("/customer-sessions/{id}/messages")
    public ApiResponse<List<SupportMessage>> getCustomerMessages(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        return ApiResponse.success(supportService.getMessages(id,
                user != null ? user.getRole() : "MERCHANT", userId));
    }

    @PutMapping("/customer-sessions/{id}/close")
    @Operation(summary = "关闭客户会话")
    public ApiResponse<Void> closeCustomerSession(@PathVariable Long id,
                                                   @RequestBody(required = false) CloseSessionRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        supportService.closeSession(id, user != null ? user.getRole() : "MERCHANT",
                userId, request != null ? request.getCloseReason() : null);
        return ApiResponse.success();
    }

    @PostMapping("/platform-sessions")
    @Operation(summary = "商家联系平台")
    public ApiResponse<SupportSession> createPlatformSession(@RequestBody CreateSessionRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        Merchant merchant = getMerchantByUserId(userId);

        SupportSession session = supportService.createSession(
                "MERCHANT_TO_PLATFORM",
                request.getTitle(),
                null,
                merchant != null ? merchant.getId() : null,
                userId,
                request.getPriority(),
                null,
                null
        );

        if (request.getFirstMessage() != null && !request.getFirstMessage().isBlank()) {
            User user = userMapper.selectById(userId);
            supportService.sendMessage(
                    session.getId(),
                    userId,
                    user != null ? user.getRole() : "MERCHANT",
                    merchant != null ? merchant.getShopName() : "Merchant",
                    merchant != null ? merchant.getShopLogo() : null,
                    "MERCHANT",
                    request.getFirstMessage(),
                    "TEXT",
                    null
            );
        }

        return ApiResponse.success(session);
    }

    @GetMapping("/platform-sessions")
    @Operation(summary = "我的平台会话列表")
    public ApiResponse<Map<String, Object>> getPlatformSessions(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(supportService.getPlatformSessions(userId, status, page, pageSize));
    }

    @GetMapping("/platform-sessions/{id}")
    @Operation(summary = "平台会话详情")
    public ApiResponse<Map<String, Object>> getPlatformSessionDetail(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        return ApiResponse.success(supportService.getSessionDetail(id,
                user != null ? user.getRole() : "MERCHANT", userId));
    }

    @PostMapping("/platform-sessions/{id}/messages")
    @Operation(summary = "发送平台消息")
    public ApiResponse<SupportMessage> sendPlatformMessage(@PathVariable Long id,
                                                            @RequestBody SendMessageRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        Merchant merchant = getMerchantByUserId(userId);
        SupportMessage message = supportService.sendMessage(
                id,
                userId,
                user != null ? user.getRole() : "MERCHANT",
                merchant != null ? merchant.getShopName() : "Merchant",
                merchant != null ? merchant.getShopLogo() : null,
                "MERCHANT",
                request.getContent(),
                request.getMessageType(),
                request.getAttachments()
        );
        return ApiResponse.success(message);
    }

    @GetMapping("/platform-sessions/{id}/messages")
    public ApiResponse<List<SupportMessage>> getPlatformMessages(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        return ApiResponse.success(supportService.getMessages(id,
                user != null ? user.getRole() : "MERCHANT", userId));
    }

    @PutMapping("/platform-sessions/{id}/close")
    public ApiResponse<Void> closePlatformSession(@PathVariable Long id,
                                                   @RequestBody(required = false) CloseSessionRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        supportService.closeSession(id, user != null ? user.getRole() : "MERCHANT",
                userId, request != null ? request.getCloseReason() : null);
        return ApiResponse.success();
    }

    @PutMapping("/sessions/{id}/read")
    @Operation(summary = "标记已读")
    public ApiResponse<Void> markAsRead(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        supportService.markAsRead(id, userId);
        return ApiResponse.success();
    }

    @GetMapping("/quick-replies")
    @Operation(summary = "获取快捷回复列表")
    public ApiResponse<Map<String, Object>> getQuickReplies() {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        List<SupportQuickReply> replies = quickReplyService.getQuickReplies("MERCHANT", userId,
                user != null ? user.getRole() : "MERCHANT");
        return ApiResponse.success(Map.of("list", replies, "total", replies.size()));
    }

    @PostMapping("/quick-replies")
    @Operation(summary = "创建快捷回复")
    public ApiResponse<SupportQuickReply> createQuickReply(@RequestBody QuickReplyRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        SupportQuickReply qr = new SupportQuickReply();
        qr.setOwnerType("MERCHANT");
        qr.setOwnerUserId(userId);
        qr.setOwnerRole(user != null ? user.getRole() : "MERCHANT");
        qr.setTitle(request.getTitle());
        qr.setContent(request.getContent());
        qr.setLanguageCode(request.getLanguageCode());
        qr.setStatus(request.getStatus());
        qr.setSort(request.getSort());
        return ApiResponse.success(quickReplyService.createQuickReply(qr));
    }

    @PutMapping("/quick-replies/{id}")
    @Operation(summary = "更新快捷回复")
    public ApiResponse<SupportQuickReply> updateQuickReply(@PathVariable Long id,
                                                            @RequestBody QuickReplyRequest request) {
        SupportQuickReply update = new SupportQuickReply();
        update.setTitle(request.getTitle());
        update.setContent(request.getContent());
        update.setLanguageCode(request.getLanguageCode());
        update.setStatus(request.getStatus());
        update.setSort(request.getSort());
        return ApiResponse.success(quickReplyService.updateQuickReply(id, update));
    }

    @DeleteMapping("/quick-replies/{id}")
    @Operation(summary = "删除快捷回复")
    public ApiResponse<Void> deleteQuickReply(@PathVariable Long id) {
        quickReplyService.deleteQuickReply(id);
        return ApiResponse.success();
    }

    private Merchant getMerchantByUserId(Long userId) {
        return merchantMapper.selectOne(
                com.baomidou.mybatisplus.core.toolkit.Wrappers.<Merchant>lambdaQuery()
                        .eq(Merchant::getUserId, userId)
                        .eq(Merchant::getDeleted, false)
        );
    }
}
