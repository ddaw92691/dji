package com.mall.api.modules.admin.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.refund.service.RefundService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/refunds")
@Tag(name = "管理员退款管理")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminRefundController {

    private final RefundService refundService;

    public AdminRefundController(RefundService refundService) {
        this.refundService = refundService;
    }

    @GetMapping
    @Operation(summary = "退款列表")
    @PreAuthorize("@perm.has('order:view')")
    public ApiResponse<Map<String, Object>> list(
            @RequestParam(required = false) String orderNo,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) String refundStatus,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ApiResponse.success(refundService.getRefundsAdmin(
                orderNo, userId, merchantId, refundStatus, startDate, endDate, page, pageSize));
    }

    @GetMapping("/{orderId}")
    @Operation(summary = "退款详情")
    @PreAuthorize("@perm.has('order:view')")
    public ApiResponse<Map<String, Object>> detail(@PathVariable Long orderId) {
        return ApiResponse.success(refundService.getRefundDetail(orderId));
    }

    @PutMapping("/{orderId}/approve")
    @Operation(summary = "批准退款")
    @PreAuthorize("@perm.has('order:cancel')")
    public ApiResponse<Void> approve(@PathVariable Long orderId) {
        refundService.approveRefund(orderId);
        return ApiResponse.success();
    }

    @PutMapping("/{orderId}/reject")
    @Operation(summary = "拒绝退款")
    @PreAuthorize("@perm.has('order:cancel')")
    public ApiResponse<Void> reject(@PathVariable Long orderId,
                                    @RequestParam(required = false) String reason,
                                    @RequestBody(required = false) Map<String, String> body) {
        if ((reason == null || reason.isBlank()) && body != null) {
            reason = body.getOrDefault("reason", body.get("rejectReason"));
        }
        refundService.rejectRefund(orderId, reason);
        return ApiResponse.success();
    }
}
