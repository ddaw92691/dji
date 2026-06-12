package com.mall.api.modules.merchant.controller;

import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
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
    private final MerchantMapper merchantMapper;

    public MerchantProductController(ProductService productService, MerchantMapper merchantMapper) {
        this.productService = productService;
        this.merchantMapper = merchantMapper;
    }

    @GetMapping("/products")
    @Operation(summary = "我的商品列表")
    public ApiResponse<Map<String, Object>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String auditStatus,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long merchantId = currentMerchantId();
        return ApiResponse.success(productService.getMerchantProductList(merchantId, keyword, status, auditStatus, page, pageSize));
    }

    @GetMapping("/products/{id}")
    @Operation(summary = "我的商品详情")
    public ApiResponse<Map<String, Object>> getProductDetail(@PathVariable Long id) {
        Long merchantId = currentMerchantId();
        return ApiResponse.success(productService.getMerchantProductDetail(merchantId, id));
    }

    @PostMapping("/products")
    @Operation(summary = "创建商家自建商品")
    public ApiResponse<Product> createProduct(@RequestBody ProductRequest request) {
        Long merchantId = currentMerchantId();
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
    @Operation(summary = "更新商家自建商品或平台商品库存")
    public ApiResponse<Product> updateProduct(@PathVariable Long id, @RequestBody ProductRequest request) {
        Long merchantId = currentMerchantId();
        Product patch = new Product();
        patch.setCategoryId(request.getCategoryId());
        patch.setTitle(request.getTitle());
        patch.setDescription(request.getDescription());
        patch.setCoverImage(request.getCoverImage());
        patch.setPrice(request.getPrice());
        patch.setOriginalPrice(request.getOriginalPrice());
        patch.setStock(request.getStock());
        Product updated = productService.updateMerchantProduct(merchantId, id, patch);
        if (updated.getPlatformProductId() == null && request.getImages() != null) {
            productService.saveImages(id, request.getImages());
        }
        if (updated.getPlatformProductId() == null && request.getTranslations() != null) {
            productService.saveTranslations(merchantId, id, request.getTranslations());
        }
        return ApiResponse.success(updated);
    }

    @DeleteMapping("/products/{id}")
    @Operation(summary = "删除/下架我的商品")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        Long merchantId = currentMerchantId();
        productService.deleteMerchantProduct(merchantId, id);
        return ApiResponse.success();
    }

    @PostMapping("/products/{id}/submit-audit")
    @Operation(summary = "提交商家自建商品审核")
    public ApiResponse<Void> submitAudit(@PathVariable Long id) {
        Long merchantId = currentMerchantId();
        productService.submitAudit(merchantId, id);
        return ApiResponse.success();
    }

    @PutMapping("/products/{id}/translations")
    @Operation(summary = "保存商家自建商品翻译")
    public ApiResponse<Void> saveTranslations(@PathVariable Long id,
                                               @RequestBody List<Map<String, String>> translations) {
        Long merchantId = currentMerchantId();
        productService.saveTranslations(merchantId, id, translations);
        return ApiResponse.success();
    }

    private Long currentMerchantId() {
        Long userId = SecurityUtils.getCurrentUserId();
        Merchant merchant = userId == null ? null : merchantMapper.selectByUserId(userId);
        if (merchant == null) {
            throw new BusinessException(ResultCode.FORBIDDEN.getCode(), "商家资料不存在");
        }
        return merchant.getId();
    }
}
