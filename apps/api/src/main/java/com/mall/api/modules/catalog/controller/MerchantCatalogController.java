package com.mall.api.modules.catalog.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.catalog.PlatformProductService;
import com.mall.api.modules.product.entity.Product;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/merchant/catalog")
@Tag(name = "商家商品目录")
@PreAuthorize("hasRole('MERCHANT')")
public class MerchantCatalogController {

    private final PlatformProductService platformProductService;

    public MerchantCatalogController(PlatformProductService platformProductService) {
        this.platformProductService = platformProductService;
    }

    @GetMapping("/products")
    @Operation(summary = "可上架的平台商品列表")
    public ApiResponse<Map<String, Object>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long merchantId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(platformProductService.getAvailableProducts(merchantId, keyword, categoryId, page, pageSize));
    }

    @PostMapping("/products/{ppId}/list")
    @Operation(summary = "上架平台商品")
    public ApiResponse<Product> listProduct(@PathVariable Long ppId, @RequestBody Map<String, Object> body) {
        Long merchantId = SecurityUtils.getCurrentUserId();
        Integer merchantStock = body.get("merchantStock") != null
                ? ((Number) body.get("merchantStock")).intValue() : null;
        String listingStatus = (String) body.get("listingStatus");
        return ApiResponse.success(platformProductService.listProduct(merchantId, ppId, merchantStock, listingStatus));
    }

    @GetMapping("/listings")
    @Operation(summary = "我的上架列表")
    public ApiResponse<Map<String, Object>> getListings(
            @RequestParam(required = false) String listingStatus,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long merchantId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(platformProductService.getMerchantListings(merchantId, listingStatus, categoryId, keyword, page, pageSize));
    }

    @PutMapping("/listings/{id}")
    @Operation(summary = "更新上架信息（库存/状态）")
    public ApiResponse<Product> updateListing(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Long merchantId = SecurityUtils.getCurrentUserId();
        Integer merchantStock = body.get("merchantStock") != null
                ? ((Number) body.get("merchantStock")).intValue() : null;
        String listingStatus = (String) body.get("listingStatus");
        return ApiResponse.success(platformProductService.updateListing(merchantId, id, merchantStock, listingStatus));
    }

    @DeleteMapping("/listings/{id}")
    @Operation(summary = "下架商品")
    public ApiResponse<Void> deleteListing(@PathVariable Long id) {
        Long merchantId = SecurityUtils.getCurrentUserId();
        platformProductService.deleteListing(merchantId, id);
        return ApiResponse.success();
    }
}
