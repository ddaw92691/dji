package com.mall.api.modules.merchant.controller;

import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.export.ExportService;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
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
@RequestMapping({"/api/merchant/orders", "/api/v1/merchant/orders"})
@Tag(name = "商家订单管理")
@PreAuthorize("hasRole('MERCHANT')")
public class MerchantOrderController {

    private final OrderService orderService;
    private final ExportService exportService;
    private final MerchantMapper merchantMapper;

    public MerchantOrderController(OrderService orderService, ExportService exportService,
                                   MerchantMapper merchantMapper) {
        this.orderService = orderService;
        this.exportService = exportService;
        this.merchantMapper = merchantMapper;
    }

    @GetMapping
    @Operation(summary = "订单列表")
    public ApiResponse<Map<String, Object>> getOrders(
            @RequestParam(required = false) String orderNo,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long merchantId = currentMerchantId();
        return ApiResponse.success(orderService.getMerchantOrders(merchantId, orderNo, status, page, pageSize));
    }

    @GetMapping("/{id}")
    @Operation(summary = "订单详情")
    public ApiResponse<OrderResponse> getOrderDetail(@PathVariable Long id) {
        Long merchantId = currentMerchantId();
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
        Long merchantId = currentMerchantId();
        orderService.shipOrder(merchantId, id, logisticsCompany, trackingNo);
        return ApiResponse.success();
    }

    @PostMapping({"/{id}/pay-goods", "/{id}/pay-cost"})
    @Operation(summary = "支付货款（垫付）")
    public ApiResponse<Void> payGoods(@PathVariable Long id,
                                      @RequestBody(required = false) Map<String, Object> body) {
        Long merchantId = currentMerchantId();
        int expectedDays = 7;
        if (body != null && body.get("expectedDays") != null) {
            try {
                expectedDays = Integer.parseInt(String.valueOf(body.get("expectedDays")).trim());
            } catch (NumberFormatException ignored) {
            }
        }
        if (expectedDays < 0) expectedDays = 0;
        java.time.LocalDateTime expectedArrivalAt = java.time.LocalDateTime.now().plusDays(expectedDays);
        orderService.merchantPayGoods(merchantId, id, expectedArrivalAt);
        return ApiResponse.success();
    }

    @GetMapping("/export")
    @Operation(summary = "导出订单CSV")
    public void exportOrders(
            @RequestParam(required = false) String orderNo,
            @RequestParam(required = false) String status,
            HttpServletResponse response) {
        Long merchantId = currentMerchantId();
        exportService.exportMerchantOrders(merchantId, orderNo, status, response);
    }

    private Long currentMerchantId() {
        Long userId = SecurityUtils.getCurrentUserId();
        Merchant merchant = userId == null ? null : merchantMapper.selectByUserId(userId);
        if (merchant == null) {
            throw new BusinessException(ResultCode.FORBIDDEN.getCode(), "Merchant profile not found");
        }
        return merchant.getId();
    }
}
