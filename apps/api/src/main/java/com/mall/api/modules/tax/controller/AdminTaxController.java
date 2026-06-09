package com.mall.api.modules.tax.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.tax.MerchantTaxService;
import com.mall.api.modules.tax.entity.MerchantTaxNotice;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/tax/notices")
@Tag(name = "Admin税务通知管理")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminTaxController {

    private final MerchantTaxService taxService;

    public AdminTaxController(MerchantTaxService taxService) {
        this.taxService = taxService;
    }

    @GetMapping
    @Operation(summary = "税务通知列表")
    public ApiResponse<Map<String, Object>> getNotices(
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String taxType,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ApiResponse.success(taxService.getAdminNotices(merchantId, status, taxType, page, pageSize));
    }

    @PostMapping
    @Operation(summary = "创建税务通知")
    public ApiResponse<MerchantTaxNotice> createNotice(@RequestBody Map<String, Object> body) {
        MerchantTaxNotice notice = buildNoticeFromBody(body);
        Long createdBy = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(taxService.createTaxNotice(notice, createdBy));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新税务通知")
    public ApiResponse<MerchantTaxNotice> updateNotice(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return ApiResponse.success(taxService.updateTaxNotice(id, buildNoticeFromBody(body)));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "取消税务通知")
    public ApiResponse<Void> cancelNotice(@PathVariable Long id) {
        taxService.cancelTaxNotice(id);
        return ApiResponse.success();
    }

    @PutMapping("/{id}/review")
    @Operation(summary = "审核税务通知支付")
    public ApiResponse<Void> reviewNotice(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        boolean approved = Boolean.TRUE.equals(body.get("approved"));
        String rejectReason = (String) body.get("rejectReason");
        Long reviewedBy = SecurityUtils.getCurrentUserId();
        taxService.reviewTaxNotice(id, approved, rejectReason, reviewedBy);
        return ApiResponse.success();
    }

    private MerchantTaxNotice buildNoticeFromBody(Map<String, Object> body) {
        MerchantTaxNotice n = new MerchantTaxNotice();
        if (body.get("merchantId") != null) n.setMerchantId(((Number) body.get("merchantId")).longValue());
        if (body.get("merchantUserId") != null) n.setMerchantUserId(((Number) body.get("merchantUserId")).longValue());
        if (body.get("title") != null) n.setTitle((String) body.get("title"));
        if (body.get("content") != null) n.setContent((String) body.get("content"));
        if (body.get("taxType") != null) n.setTaxType((String) body.get("taxType"));
        if (body.get("amount") != null) n.setAmount(new java.math.BigDecimal(body.get("amount").toString()));
        if (body.get("currencyCode") != null) n.setCurrencyCode((String) body.get("currencyCode"));
        if (body.get("dueAt") != null) n.setDueAt(java.time.LocalDateTime.parse(body.get("dueAt").toString().replace("Z", "")));
        if (body.get("forcePopup") != null) n.setForcePopup((Boolean) body.get("forcePopup"));
        if (body.get("blockUntilPaid") != null) n.setBlockUntilPaid((Boolean) body.get("blockUntilPaid"));
        return n;
    }
}
