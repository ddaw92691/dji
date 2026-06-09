package com.mall.api.modules.merchant.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.product.ProductService;
import com.mall.api.modules.product.dto.ProductRequest;
import com.mall.api.modules.product.entity.Product;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/merchant")
@Tag(name = "商家商品管理")
@PreAuthorize("hasRole('MERCHANT')")
public class MerchantProductController {

    private final ProductService productService;

    public MerchantProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products")
    @Operation(summary = "我的商品列表")
    public ApiResponse<Map<String, Object>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String auditStatus,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long merchantId = SecurityUtils.getCurrentUserId();
        Page<Product> pg = productService.getMerchantProducts(merchantId, keyword, status, auditStatus, page, pageSize);
        return ApiResponse.success(Map.of("list", pg.getRecords(), "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }

    @PostMapping("/products")
    @Operation(summary = "创建商品")
    public ApiResponse<Product> createProduct(@RequestBody ProductRequest request) {
        Long merchantId = SecurityUtils.getCurrentUserId();
        Product product = new Product();
        product.setMerchantId(merchantId);
        product.setCategoryId(request.getCategoryId());
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setCoverImage(request.getCoverImage());
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setStock(request.getStock());
        product.setStatus("DRAFT");
        product.setAuditStatus("DRAFT");
        product.setDeleted(false);
        product.setSalesCount(0);
        productService.createProduct(product);
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            productService.saveImages(product.getId(), request.getImages());
        }
        if (request.getTranslations() != null && !request.getTranslations().isEmpty()) {
            productService.saveTranslations(product.getId(), request.getTranslations());
        }
        return ApiResponse.success(product);
    }

    @PutMapping("/products/{id}")
    @Operation(summary = "更新商品")
    public ApiResponse<Product> updateProduct(@PathVariable Long id, @RequestBody ProductRequest request) {
        Product existing = new Product();
        existing.setCategoryId(request.getCategoryId());
        existing.setTitle(request.getTitle());
        existing.setDescription(request.getDescription());
        existing.setCoverImage(request.getCoverImage());
        existing.setPrice(request.getPrice());
        existing.setOriginalPrice(request.getOriginalPrice());
        existing.setStock(request.getStock());
        Product updated = productService.updateProduct(id, existing);
        if (request.getImages() != null) {
            productService.saveImages(id, request.getImages());
        }
        return ApiResponse.success(updated);
    }

    @DeleteMapping("/products/{id}")
    @Operation(summary = "删除商品")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ApiResponse.success();
    }

    @PostMapping("/products/{id}/submit-audit")
    @Operation(summary = "提交审核")
    public ApiResponse<Void> submitAudit(@PathVariable Long id) {
        productService.submitAudit(id);
        return ApiResponse.success();
    }

    @PutMapping("/products/{id}/translations")
    @Operation(summary = "保存商品翻译")
    public ApiResponse<Void> saveTranslations(@PathVariable Long id,
                                               @RequestBody List<Map<String, String>> translations) {
        productService.saveTranslations(id, translations);
        return ApiResponse.success();
    }
}
