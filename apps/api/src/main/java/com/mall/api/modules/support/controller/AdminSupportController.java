package com.mall.api.modules.support.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.support.dto.*;
import com.mall.api.modules.support.entity.SupportMessage;
import com.mall.api.modules.support.entity.SupportQuickReply;
import com.mall.api.modules.support.entity.SupportSession;
import com.mall.api.modules.support.service.SupportInspectionService;
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
@RequestMapping("/api/admin/support")
@Tag(name = "管理员客服")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminSupportController {

    private final SupportService supportService;
    private final SupportQuickReplyService quickReplyService;
    private final SupportInspectionService inspectionService;
    private final UserMapper userMapper;

    public AdminSupportController(SupportService supportService,
                                   SupportQuickReplyService quickReplyService,
                                   SupportInspectionService inspectionService,
                                   UserMapper userMapper) {
        this.supportService = supportService;
        this.quickReplyService = quickReplyService;
        this.inspectionService = inspectionService;
        this.userMapper = userMapper;
    }

    @GetMapping("/customer-merchant-sessions")
    @Operation(summary = "所有客户-商家会话(含内部字段)")
    @PreAuthorize("@perm.has('support:customerMerchant:view')")
    public ApiResponse<Map<String, Object>> getCustomerMerchantSessions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long merchantId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ApiResponse.success(supportService.getAdminCustomerMerchantSessions(
                status, keyword, merchantId, page, pageSize));
    }

    @GetMapping("/customer-merchant-sessions/{id}")
    @Operation(summary = "客户-商家会话详情(含内部字段)")
    @PreAuthorize("@perm.has('support:customerMerchant:view')")
    public ApiResponse<Map<String, Object>> getCustomerMerchantSessionDetail(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        return ApiResponse.success(supportService.getSessionDetail(id,
                user != null ? user.getRole() : "ADMIN", userId));
    }

    @PutMapping("/customer-merchant-sessions/{id}/close")
    @PreAuthorize("@perm.has('support:customerMerchant:close')")
    public ApiResponse<Void> closeCustomerMerchantSession(@PathVariable Long id,
                                                           @RequestBody(required = false) CloseSessionRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        supportService.closeSession(id, user != null ? user.getRole() : "ADMIN",
                userId, request != null ? request.getCloseReason() : null);
        return ApiResponse.success();
    }

    @GetMapping("/platform-sessions")
    @Operation(summary = "所有平台会话")
    @PreAuthorize("@perm.has('support:platform:view')")
    public ApiResponse<Map<String, Object>> getPlatformSessions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long merchantId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ApiResponse.success(supportService.getAdminPlatformSessions(status, keyword, merchantId, page, pageSize));
    }

    @GetMapping("/platform-sessions/{id}")
    @Operation(summary = "平台会话详情")
    @PreAuthorize("@perm.has('support:platform:view')")
    public ApiResponse<Map<String, Object>> getPlatformSessionDetail(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        return ApiResponse.success(supportService.getSessionDetail(id,
                user != null ? user.getRole() : "ADMIN", userId));
    }

    @PostMapping("/platform-sessions/{id}/messages")
    @Operation(summary = "管理员回复平台会话")
    @PreAuthorize("@perm.has('support:platform:reply')")
    public ApiResponse<SupportMessage> replyPlatformSession(@PathVariable Long id,
                                                             @RequestBody SendMessageRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        SupportMessage message = supportService.sendMessage(
                id,
                userId,
                user != null ? user.getRole() : "ADMIN",
                user != null ? user.getNickname() : "Admin",
                user != null ? user.getAvatar() : null,
                "ADMIN",
                request.getContent(),
                request.getMessageType(),
                request.getAttachments()
        );
        return ApiResponse.success(message);
    }

    @PutMapping("/platform-sessions/{id}/close")
    @Operation(summary = "关闭平台会话")
    @PreAuthorize("@perm.has('support:platform:close')")
    public ApiResponse<Void> closePlatformSession(@PathVariable Long id,
                                                   @RequestBody(required = false) CloseSessionRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        supportService.closeSession(id, user != null ? user.getRole() : "ADMIN",
                userId, request != null ? request.getCloseReason() : null);
        return ApiResponse.success();
    }

    @PostMapping("/inspection-sessions")
    @Operation(summary = "创建巡检会话")
    @PreAuthorize("@perm.has('support:inspection:create')")
    public ApiResponse<SupportSession> createInspectionSession(@RequestBody CreateInspectionRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        SupportSession session = supportService.createInspectionSession(
                userId,
                request.getFakeCustomerName(),
                request.getTitle(),
                request.getInspectionCustomerUserId(),
                request.getMerchantId(),
                request.getQuestion(),
                request.getRelatedProductId(),
                request.getRelatedOrderId(),
                request.getPriority()
        );
        return ApiResponse.success(session);
    }

    @PutMapping("/inspection-sessions/{id}/score")
    @Operation(summary = "巡检评分")
    @PreAuthorize("@perm.has('support:inspection:score')")
    public ApiResponse<Void> scoreInspection(@PathVariable Long id,
                                              @RequestBody ScoreInspectionRequest request) {
        supportService.scoreInspection(id, request.getQualityScore(), request.getQualityRemark());
        return ApiResponse.success();
    }

    @GetMapping("/inspection-sessions")
    @Operation(summary = "巡检会话列表")
    @PreAuthorize("@perm.has('support:inspection:view')")
    public ApiResponse<Map<String, Object>> getInspectionSessions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long merchantId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ApiResponse.success(supportService.getAdminInspectionSessions(
                status, merchantId, page, pageSize));
    }

    @GetMapping("/inspection-sessions/{id}")
    @PreAuthorize("@perm.has('support:inspection:view')")
    public ApiResponse<Map<String, Object>> getInspectionSessionDetail(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        return ApiResponse.success(supportService.getSessionDetail(id,
                user != null ? user.getRole() : "ADMIN", userId));
    }

    @GetMapping("/sessions/{id}/messages")
    @PreAuthorize("@perm.hasAny('support:platform:view','support:inspection:view','support:customerMerchant:view')")
    public ApiResponse<List<SupportMessage>> getMessages(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userMapper.selectById(userId);
        return ApiResponse.success(supportService.getMessages(id,
                user != null ? user.getRole() : "ADMIN", userId));
    }

    @GetMapping("/inspection-logs")
    @Operation(summary = "巡检日志列表")
    @PreAuthorize("@perm.has('support:inspection:view')")
    public ApiResponse<Map<String, Object>> getInspectionLogs(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long merchantId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ApiResponse.success(inspectionService.getInspectionLogs(status, merchantId, page, pageSize));
    }

    @PutMapping("/sessions/{id}/read")
    @Operation(summary = "标记已读")
    @PreAuthorize("@perm.hasAny('support:platform:view','support:inspection:view','support:customerMerchant:view')")
    public ApiResponse<Void> markAsRead(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        supportService.markAsRead(id, userId);
        return ApiResponse.success();
    }

    @GetMapping("/quick-replies")
    @Operation(summary = "获取平台快捷回复列表")
    @PreAuthorize("@perm.has('support:quickReply:view')")
    public ApiResponse<Map<String, Object>> getQuickReplies() {
        User user = userMapper.selectById(SecurityUtils.getCurrentUserId());
        List<SupportQuickReply> replies = quickReplyService.getQuickReplies("PLATFORM", null,
                user != null ? user.getRole() : "ADMIN");
        return ApiResponse.success(Map.of("list", replies, "total", replies.size()));
    }

    @PostMapping("/quick-replies")
    @Operation(summary = "创建平台快捷回复")
    @PreAuthorize("@perm.has('support:quickReply:add')")
    public ApiResponse<SupportQuickReply> createQuickReply(@RequestBody QuickReplyRequest request) {
        User user = userMapper.selectById(SecurityUtils.getCurrentUserId());
        SupportQuickReply qr = new SupportQuickReply();
        qr.setOwnerType("PLATFORM");
        qr.setOwnerUserId(null);
        qr.setOwnerRole(user != null ? user.getRole() : "ADMIN");
        qr.setTitle(request.getTitle());
        qr.setContent(request.getContent());
        qr.setLanguageCode(request.getLanguageCode());
        qr.setStatus(request.getStatus());
        qr.setSort(request.getSort());
        return ApiResponse.success(quickReplyService.createQuickReply(qr));
    }

    @PutMapping("/quick-replies/{id}")
    @Operation(summary = "更新平台快捷回复")
    @PreAuthorize("@perm.has('support:quickReply:edit')")
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
    @Operation(summary = "删除平台快捷回复")
    @PreAuthorize("@perm.has('support:quickReply:delete')")
    public ApiResponse<Void> deleteQuickReply(@PathVariable Long id) {
        quickReplyService.deleteQuickReply(id);
        return ApiResponse.success();
    }
}
