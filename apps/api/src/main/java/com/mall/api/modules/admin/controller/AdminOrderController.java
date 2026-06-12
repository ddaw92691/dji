package com.mall.api.modules.admin.controller;

import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.export.ExportService;
import com.mall.api.modules.log.annotation.Audit;
import com.mall.api.modules.order.OrderService;
import com.mall.api.modules.order.dto.OrderResponse;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/admin/orders", "/api/v1/admin/orders"})
@Tag(name = "管理员订单管理")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminOrderController {

    private final OrderService orderService;
    private final ExportService exportService;

    public AdminOrderController(OrderService orderService, ExportService exportService) {
        this.orderService = orderService;
        this.exportService = exportService;
    }

    @GetMapping
    @Operation(summary = "订单列表")
    @PreAuthorize("@perm.has('order:view')")
    public ApiResponse<Map<String, Object>> getOrders(
            @RequestParam(required = false) String orderNo,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ApiResponse.success(orderService.getAllOrders(orderNo, userId, merchantId, status, page, pageSize));
    }

    @GetMapping("/{id}")
    @Operation(summary = "订单详情")
    @PreAuthorize("@perm.has('order:detail')")
    public ApiResponse<OrderResponse> getOrderDetail(@PathVariable Long id) {
        return ApiResponse.success(orderService.getOrderDetailAdmin(id));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "更新订单状态")
    @PreAuthorize("@perm.hasAny('order:ship','order:cancel')")
    public ApiResponse<Void> updateOrderStatus(@PathVariable Long id,
                                                @RequestParam(required = false) String status,
                                                @RequestParam(required = false) String remark,
                                                @RequestBody(required = false) Map<String, String> body) {
        if ((status == null || status.isBlank()) && body != null) {
            status = body.get("status");
        }
        if ((remark == null || remark.isBlank()) && body != null) {
            remark = body.get("remark");
        }
        orderService.updateOrderStatus(id, status, remark);
        return ApiResponse.success();
    }

    @PostMapping("/{id}/settle-merchant")
    @Operation(summary = "结算货款+利润给商家（垫付单到货后）")
    @PreAuthorize("@perm.has('order:ship')")
    @Audit(module = "订单管理", action = "结算货款", description = "到货后结算货款+利润给商家")
    public ApiResponse<Void> settleMerchant(@PathVariable Long id) {
        orderService.settleToMerchant(id, SecurityUtils.getCurrentUserId(), null);
        return ApiResponse.success();
    }

    @PostMapping("/{id}/set-estimated-arrival")
    @Operation(summary = "Set estimated arrival time")
    @PreAuthorize("@perm.has('order:ship')")
    @Audit(module = "Order", action = "Set estimated arrival", description = "Admin sets estimated arrival time")
    public ApiResponse<Void> setEstimatedArrival(@PathVariable Long id,
                                                 @RequestBody Map<String, Object> body) {
        Object value = body == null ? null : body.get("expectedArrivalAt");
        if (value == null && body != null) {
            value = body.get("estimatedArrivalTime");
        }
        if (value == null || String.valueOf(value).isBlank()) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Expected arrival time is required");
        }
        orderService.setEstimatedArrival(id, java.time.LocalDateTime.parse(String.valueOf(value)));
        return ApiResponse.success();
    }

    @PostMapping("/{id}/mark-arrived")
    @Operation(summary = "Mark order arrived")
    @PreAuthorize("@perm.has('order:ship')")
    @Audit(module = "Order", action = "Mark arrived", description = "Admin marks merchant advance order arrived")
    public ApiResponse<Void> markArrived(@PathVariable Long id) {
        orderService.markArrived(id);
        return ApiResponse.success();
    }

    @PostMapping("/{id}/settle")
    @Operation(summary = "Settle goods cost and profit")
    @PreAuthorize("@perm.has('order:ship')")
    @Audit(module = "Order", action = "Settle merchant order", description = "Admin settles goods cost and profit to merchant")
    public ApiResponse<Void> settle(@PathVariable Long id,
                                    @RequestBody(required = false) Map<String, Object> body) {
        String remark = body == null || body.get("remark") == null ? null : String.valueOf(body.get("remark"));
        orderService.settleToMerchant(id, SecurityUtils.getCurrentUserId(), remark);
        return ApiResponse.success();
    }

    @GetMapping("/{id}/settlement-records")
    @Operation(summary = "Order settlement records")
    @PreAuthorize("@perm.has('order:view')")
    public ApiResponse<List<?>> settlementRecords(@PathVariable Long id) {
        return ApiResponse.success(orderService.getSettlementRecords(id));
    }

    @GetMapping("/export")
    @Operation(summary = "导出订单CSV")
    @PreAuthorize("@perm.has('order:view')")
    public void exportOrders(
            @RequestParam(required = false) String orderNo,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) String status,
            HttpServletResponse response) {
        exportService.exportOrders(orderNo, userId, merchantId, status, response);
    }

    @PostMapping("/create-for-merchant")
    @Operation(summary = "管理员为商家创建订单")
    @PreAuthorize("@perm.has('admin:order:create')")
    public ApiResponse<OrderResponse> createForMerchant(@RequestBody Map<String, Object> body) {
        if (body == null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "请求参数不能为空");
        }
        Long adminId = SecurityUtils.getCurrentUserId();
        Long customerId = toLong(body.get("customerId"), "客户不能为空");
        Long merchantId = toLong(body.get("merchantId"), "商家不能为空");
        boolean markAsPaid = body.get("markAsPaid") == null || Boolean.TRUE.equals(body.get("markAsPaid"));
        String remark = body.get("remark") == null ? null : String.valueOf(body.get("remark"));
        Long addressId = body.get("addressId") != null ? toLong(body.get("addressId"), "地址参数不正确") : null;

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items = body.get("items") instanceof List<?> ? (List<Map<String, Object>>) body.get("items") : null;
        if (items == null || items.isEmpty()) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "订单商品不能为空");
        }

        return ApiResponse.success(orderService.adminCreateOrder(adminId, customerId, merchantId,
                items, addressId, markAsPaid, remark));
    }

    private Long toLong(Object value, String errorMessage) {
        if (value == null || String.valueOf(value).isBlank()) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), errorMessage);
        }
        if (value instanceof Number n) {
            return n.longValue();
        }
        try {
            return Long.valueOf(String.valueOf(value));
        } catch (NumberFormatException e) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), errorMessage);
        }
    }
}
