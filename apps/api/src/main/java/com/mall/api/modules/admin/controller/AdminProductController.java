package com.mall.api.modules.admin.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.notification.NotificationService;
import com.mall.api.modules.product.ProductService;
import com.mall.api.modules.product.entity.Product;
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
    public ApiResponse<Map<String, Object>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String auditStatus,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Page<Product> pg = productService.getAllProducts(keyword, categoryId, merchantId, status, auditStatus,
                page, pageSize);
        return ApiResponse.success(Map.of("list", pg.getRecords(), "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }

    @GetMapping("/{id}")
    @Operation(summary = "商品详情")
    public ApiResponse<Map<String, Object>> getProductDetail(@PathVariable Long id) {
        Map<String, Object> detail = productService.getProductDetail(id, null, null);
        if (detail == null) {
            return ApiResponse.error(404, "商品不存在");
        }
        return ApiResponse.success(detail);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "上架/下架商品")
    public ApiResponse<Void> updateProductStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        productService.updateProductStatus(id, body.get("status"));
        return ApiResponse.success();
    }

    @GetMapping("/audit")
    @Operation(summary = "待审核商品列表")
    public ApiResponse<Map<String, Object>> getPendingAudit(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Page<Product> pg = productService.getPendingAuditProducts(page, pageSize);
        return ApiResponse.success(Map.of("list", pg.getRecords(), "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }

    @PutMapping("/{id}/audit")
    @Operation(summary = "审核商品")
    public ApiResponse<Void> auditProduct(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String auditStatus = (String) body.get("auditStatus");
        String auditRemark = (String) body.get("auditRemark");
        Long auditBy = body.get("auditBy") != null ? Long.valueOf(body.get("auditBy").toString()) : null;
        productService.auditProduct(id, auditStatus, auditRemark, auditBy);

        Product product = productService.getProductDetail(id, null, null) != null ? null : null;
        Map<String, Object> detail = productService.getProductDetail(id, null, null);
        if (detail != null && detail.get("merchantId") != null) {
            Long merchantId = Long.valueOf(detail.get("merchantId").toString());
            if ("APPROVED".equals(auditStatus)) {
                notificationService.createMerchantNotification(merchantId,
                        "Product approved", "Your product has been approved and is now on sale.",
                        "PRODUCT_AUDIT", "product", id);
            } else if ("REJECTED".equals(auditStatus)) {
                notificationService.createMerchantNotification(merchantId,
                        "Product rejected", "Your product has been rejected" +
                                (auditRemark != null ? ": " + auditRemark : ""),
                        "PRODUCT_AUDIT", "product", id);
            }
        }
        return ApiResponse.success();
    }
}
