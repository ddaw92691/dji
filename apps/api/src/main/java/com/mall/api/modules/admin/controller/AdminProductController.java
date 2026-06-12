package com.mall.api.modules.admin.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.notification.NotificationService;
import com.mall.api.modules.product.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
@Tag(name = "Admin商品管理")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminProductController {

    private final ProductService productService;
    private final NotificationService notificationService;

    public AdminProductController(ProductService productService, NotificationService notificationService) {
        this.productService = productService;
        this.notificationService = notificationService;
    }

    @GetMapping
    @Operation(summary = "商品列表")
    @PreAuthorize("@perm.has('product:view')")
    public ApiResponse<Map<String, Object>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String auditStatus,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ApiResponse.success(productService.getAdminProductList(keyword, categoryId, merchantId, status, auditStatus,
                page, pageSize));
    }

    @GetMapping("/{id}")
    @Operation(summary = "商品详情")
    @PreAuthorize("@perm.has('product:view')")
    public ApiResponse<Map<String, Object>> getProductDetail(@PathVariable Long id) {
                Map<String, Object> detail = productService.getProductDetail(id, null, null);
        if (detail == null) {
            return ApiResponse.error(404, "商品不存在");
        }
        return ApiResponse.success(detail);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "上架/下架商品")
    @PreAuthorize("@perm.has('product:edit')")
    public ApiResponse<Void> updateProductStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        productService.updateProductStatus(id, body.get("status"));
        return ApiResponse.success();
    }

    @GetMapping("/audit")
    @Operation(summary = "待审核商品列表")
    @PreAuthorize("@perm.has('product:audit')")
    public ApiResponse<Map<String, Object>> getPendingAudit(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ApiResponse.success(productService.getAdminProductList(null, null, null, null, "PENDING", page, pageSize));
    }

    @PutMapping("/{id}/audit")
    @Operation(summary = "审核商品")
    @PreAuthorize("@perm.hasAny('product:audit:approve','product:audit:reject')")
    public ApiResponse<Void> auditProduct(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String auditStatus = (String) body.get("auditStatus");
        String auditRemark = (String) body.get("auditRemark");
        Long auditBy = body.get("auditBy") != null ? Long.valueOf(body.get("auditBy").toString()) : null;
        productService.auditProduct(id, auditStatus, auditRemark, auditBy);

        Map<String, Object> detail = productService.getProductDetail(id, null, null);
        if (detail != null && detail.get("merchantId") != null) {
            Long merchantId = Long.valueOf(detail.get("merchantId").toString());
            if ("APPROVED".equals(auditStatus)) {
                notificationService.createMerchantNotification(merchantId,
                        "商品审核通过", "您的商品已审核通过并上架。",
                        "PRODUCT_AUDIT", "product", id);
            } else if ("REJECTED".equals(auditStatus)) {
                notificationService.createMerchantNotification(merchantId,
                        "商品审核拒绝", "您的商品审核未通过" +
                                (auditRemark != null ? "：" + auditRemark : ""),
                        "PRODUCT_AUDIT", "product", id);
            }
        }
        return ApiResponse.success();
    }
}
