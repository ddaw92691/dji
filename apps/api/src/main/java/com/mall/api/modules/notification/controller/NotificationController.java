package com.mall.api.modules.notification.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.notification.NotificationService;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({
        "/api/notifications",
        "/api/admin/notifications",
        "/api/merchant/notifications",
        "/api/customer/notifications"
})
@Tag(name = "通知")
@PreAuthorize("isAuthenticated()")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    @Operation(summary = "我的通知列表")
    public ApiResponse<Map<String, Object>> getNotifications(
            @RequestParam(required = false) String readStatus,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(notificationService.getMyNotifications(userId, readStatus, type, page, pageSize));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "未读通知数量")
    public ApiResponse<Long> getUnreadCount() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(notificationService.getUnreadCount(userId));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "标记已读")
    public ApiResponse<Void> markAsRead(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        notificationService.markAsRead(userId, id);
        return ApiResponse.success();
    }

    @PutMapping("/read-all")
    @Operation(summary = "全部标记已读")
    public ApiResponse<Void> markAllAsRead() {
        Long userId = SecurityUtils.getCurrentUserId();
        notificationService.markAllAsRead(userId);
        return ApiResponse.success();
    }
}
