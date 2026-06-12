package com.mall.api.modules.catalog.controller;

import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.catalog.PlatformProductService;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.product.entity.Product;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/merchant/catalog")
@Tag(name = "商家商品库")
@PreAuthorize("hasRole('MERCHANT')")
public class MerchantCatalogController {

    private final PlatformProductService platformProductService;
    private final MerchantMapper merchantMapper;

    public MerchantCatalogController(PlatformProductService platformProductService,
                                     MerchantMapper merchantMapper) {
        this.platformProductService = platformProductService;
        this.merchantMapper = merchantMapper;
    }

    @GetMapping("/products")
    @Operation(summary = "可上架的平台商品库列表")
    public ApiResponse<Map<String, Object>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long merchantId = currentMerchantId();
        return ApiResponse.success(platformProductService.getAvailableProducts(merchantId, keyword, categoryId, page, pageSize));
    }

    @PostMapping("/products/{ppId}/list")
    @Operation(summary = "从平台商品库上架商品")
    public ApiResponse<Product> listProduct(@PathVariable Long ppId, @RequestBody Map<String, Object> body) {
        Long merchantId = currentMerchantId();
        Integer merchantStock = body.get("merchantStock") != null
                ? ((Number) body.get("merchantStock")).intValue() : null;
        String listingStatus = (String) (body.get("listingStatus") != null ? body.get("listingStatus") : body.get("status"));
        return ApiResponse.success(platformProductService.listProduct(merchantId, ppId, merchantStock, listingStatus));
    }

    @GetMapping("/listings")
    @Operation(summary = "我的平台商品库上架列表")
    public ApiResponse<Map<String, Object>> getListings(
            @RequestParam(required = false) String listingStatus,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long merchantId = currentMerchantId();
        return ApiResponse.success(platformProductService.getMerchantListings(merchantId, listingStatus, categoryId, keyword, page, pageSize));
    }

    @PutMapping("/listings/{id}")
    @Operation(summary = "更新平台商品库上架信息（库存/状态）")
    public ApiResponse<Product> updateListing(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Long merchantId = currentMerchantId();
        Integer merchantStock = body.get("merchantStock") != null
                ? ((Number) body.get("merchantStock")).intValue() : null;
        String listingStatus = (String) (body.get("listingStatus") != null ? body.get("listingStatus") : body.get("status"));
        return ApiResponse.success(platformProductService.updateListing(merchantId, id, merchantStock, listingStatus));
    }

    @DeleteMapping("/listings/{id}")
    @Operation(summary = "下架平台商品库商品")
    public ApiResponse<Void> deleteListing(@PathVariable Long id) {
        Long merchantId = currentMerchantId();
        platformProductService.deleteListing(merchantId, id);
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
