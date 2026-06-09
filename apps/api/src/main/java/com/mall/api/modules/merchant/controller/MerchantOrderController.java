package com.mall.api.modules.merchant.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.export.ExportService;
import com.mall.api.modules.order.OrderService;
import com.mall.api.modules.order.dto.OrderResponse;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/merchant/orders")
@Tag(name = "商家订单管理")
@PreAuthorize("hasRole('MERCHANT')")
public class MerchantOrderController {

    private final OrderService orderService;
    private final ExportService exportService;

    public MerchantOrderController(OrderService orderService, ExportService exportService) {
        this.orderService = orderService;
        this.exportService = exportService;
    }

    @GetMapping
    @Operation(summary = "订单列表")
    public ApiResponse<Map<String, Object>> getOrders(
            @RequestParam(required = false) String orderNo,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long merchantId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(orderService.getMerchantOrders(merchantId, orderNo, status, page, pageSize));
    }

    @GetMapping("/{id}")
    @Operation(summary = "订单详情")
    public ApiResponse<OrderResponse> getOrderDetail(@PathVariable Long id) {
        Long merchantId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(orderService.getMerchantOrderDetail(merchantId, id));
    }

    @PostMapping("/{id}/ship")
    @Operation(summary = "发货")
    public ApiResponse<Void> shipOrder(@PathVariable Long id,
                                        @RequestParam(required = false) String logisticsCompany,
                                        @RequestParam(required = false) String trackingNo,
                                        @RequestBody(required = false) Map<String, String> body) {
        if ((logisticsCompany == null || logisticsCompany.isBlank()) && body != null) {
            logisticsCompany = body.get("logisticsCompany");
        }
        if ((trackingNo == null || trackingNo.isBlank()) && body != null) {
            trackingNo = body.get("trackingNo");
        }
        Long merchantId = SecurityUtils.getCurrentUserId();
        orderService.shipOrder(merchantId, id, logisticsCompany, trackingNo);
        return ApiResponse.success();
    }

    @GetMapping("/export")
    @Operation(summary = "导出订单CSV")
    public void exportOrders(
            @RequestParam(required = false) String orderNo,
            @RequestParam(required = false) String status,
            HttpServletResponse response) {
        Long merchantId = SecurityUtils.getCurrentUserId();
        exportService.exportMerchantOrders(merchantId, orderNo, status, response);
    }
}
