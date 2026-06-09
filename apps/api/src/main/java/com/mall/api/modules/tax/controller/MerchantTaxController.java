package com.mall.api.modules.tax.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.tax.MerchantTaxService;
import com.mall.api.modules.tax.entity.MerchantTaxNotice;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/merchant/tax")
@Tag(name = "商家税务通知")
@PreAuthorize("hasRole('MERCHANT')")
public class MerchantTaxController {

    private final MerchantTaxService taxService;

    public MerchantTaxController(MerchantTaxService taxService) {
        this.taxService = taxService;
    }

    @GetMapping("/notices")
    @Operation(summary = "我的税务通知列表")
    public ApiResponse<Map<String, Object>> getNotices(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String taxType,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long merchantId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(taxService.getMerchantNotices(merchantId, status, taxType, page, pageSize));
    }

    @GetMapping("/notices/pending-blocking")
    @Operation(summary = "获取需要强制弹窗的待处理通知")
    public ApiResponse<List<MerchantTaxNotice>> getPendingBlocking() {
        Long merchantId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(taxService.getPendingBlocking(merchantId));
    }

    @PostMapping("/notices/{id}/payment-proof")
    @Operation(summary = "提交支付凭证")
    public ApiResponse<Void> submitPaymentProof(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Long merchantId = SecurityUtils.getCurrentUserId();
        taxService.submitPaymentProof(merchantId, id, body.get("method"), body.get("proof"), body.get("remark"));
        return ApiResponse.success();
    }
}
