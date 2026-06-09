package com.mall.api.modules.customer.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.order.OrderService;
import com.mall.api.modules.order.dto.CreateOrderRequest;
import com.mall.api.modules.order.dto.OrderResponse;
import com.mall.api.modules.payment.entity.Payment;
import com.mall.api.modules.refund.service.RefundService;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/customer/orders")
@Tag(name = "用户订单")
@PreAuthorize("isAuthenticated()")
public class OrderController {

    private final OrderService orderService;
    private final RefundService refundService;

    public OrderController(OrderService orderService, RefundService refundService) {
        this.orderService = orderService;
        this.refundService = refundService;
    }

    @PostMapping
    @Operation(summary = "创建订单")
    public ApiResponse<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(orderService.createOrder(userId, request));
    }

    @GetMapping
    @Operation(summary = "订单列表")
    public ApiResponse<Map<String, Object>> getOrders(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(orderService.getOrders(userId, status, page, pageSize));
    }

    @GetMapping("/{id}")
    @Operation(summary = "订单详情")
    public ApiResponse<OrderResponse> getOrderDetail(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(orderService.getOrderDetail(userId, id));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "取消订单")
    public ApiResponse<Void> cancelOrder(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        orderService.cancelOrder(userId, id);
        return ApiResponse.success();
    }

    @PostMapping("/{id}/pay")
    @Operation(summary = "支付订单")
    public ApiResponse<Payment> payOrder(@PathVariable Long id,
                                         @RequestParam(required = false) String method,
                                         @RequestBody(required = false) Map<String, String> body) {
        if ((method == null || method.isBlank()) && body != null) {
            method = body.get("method");
        }
        if (method == null || method.isBlank()) {
            method = "BALANCE";
        }
        Long userId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(orderService.payOrder(userId, id, method));
    }

    @PostMapping("/{id}/confirm")
    @Operation(summary = "确认收货")
    public ApiResponse<Void> confirmOrder(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        orderService.confirmOrder(userId, id);
        return ApiResponse.success();
    }

    @PostMapping("/{id}/refund")
    @Operation(summary = "申请退款")
    public ApiResponse<Void> requestRefund(@PathVariable Long id,
                                           @RequestParam(required = false) String reason,
                                           @RequestBody(required = false) Map<String, String> body) {
        if ((reason == null || reason.isBlank()) && body != null) {
            reason = body.get("reason");
        }
        Long userId = SecurityUtils.getCurrentUserId();
        refundService.requestRefund(userId, id, reason);
        return ApiResponse.success();
    }
}
