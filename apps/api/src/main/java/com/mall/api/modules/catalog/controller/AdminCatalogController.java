package com.mall.api.modules.catalog.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.catalog.PlatformProductService;
import com.mall.api.modules.catalog.entity.PlatformProduct;
import com.mall.api.modules.catalog.entity.PlatformProductImage;
import com.mall.api.modules.catalog.entity.PlatformProductTranslation;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/catalog/products")
@Tag(name = "Admin平台商品目录")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminCatalogController {

    private final PlatformProductService platformProductService;

    public AdminCatalogController(PlatformProductService platformProductService) {
        this.platformProductService = platformProductService;
    }

    @GetMapping
    @Operation(summary = "平台商品列表")
    @PreAuthorize("@perm.has('admin:catalog:view')")
    public ApiResponse<Map<String, Object>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ApiResponse.success(platformProductService.getProducts(keyword, categoryId, status, page, pageSize));
    }

    @GetMapping("/{id}")
    @Operation(summary = "平台商品详情")
    @PreAuthorize("@perm.has('admin:catalog:view')")
    public ApiResponse<Map<String, Object>> getProductDetail(@PathVariable Long id) {
        return ApiResponse.success(platformProductService.getProductDetail(id));
    }

    @PostMapping
    @Operation(summary = "创建平台商品")
    @PreAuthorize("@perm.has('admin:catalog:add')")
    public ApiResponse<PlatformProduct> createProduct(@RequestBody Map<String, Object> body) {
        PlatformProduct pp = buildProductFromBody(body);
        Long createdBy = SecurityUtils.getCurrentUserId();

        List<PlatformProductImage> images = null;
        if (body.get("images") instanceof List<?> imgList) {
            images = imgList.stream().map(obj -> {
                Map<?, ?> m = (Map<?, ?>) obj;
                PlatformProductImage img = new PlatformProductImage();
                img.setUrl((String) (m.get("url") != null ? m.get("url") : m.get("imageUrl")));
                img.setSort(m.get("sort") != null ? ((Number) m.get("sort")).intValue() : 0);
                return img;
            }).toList();
        }

        List<PlatformProductTranslation> translations = null;
        if (body.get("translations") instanceof List<?> transList) {
            translations = transList.stream().map(obj -> {
                Map<?, ?> m = (Map<?, ?>) obj;
                PlatformProductTranslation t = new PlatformProductTranslation();
                t.setLanguageCode((String) m.get("languageCode"));
                t.setCountryCode((String) m.get("countryCode"));
                t.setName((String) m.get("name"));
                t.setDescription((String) m.get("description"));
                return t;
            }).toList();
        }

        return ApiResponse.success(platformProductService.createProduct(pp, images, translations, createdBy));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新平台商品")
    @PreAuthorize("@perm.has('admin:catalog:edit')")
    public ApiResponse<PlatformProduct> updateProduct(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        PlatformProduct pp = buildProductFromBody(body);
        Long updatedBy = SecurityUtils.getCurrentUserId();

        List<PlatformProductImage> images = null;
        if (body.containsKey("images")) {
            if (body.get("images") instanceof List<?> imgList) {
                images = imgList.stream().map(obj -> {
                    Map<?, ?> m = (Map<?, ?>) obj;
                    PlatformProductImage img = new PlatformProductImage();
                    img.setUrl((String) (m.get("url") != null ? m.get("url") : m.get("imageUrl")));
                    img.setSort(m.get("sort") != null ? ((Number) m.get("sort")).intValue() : 0);
                    return img;
                }).toList();
            }
        }

        List<PlatformProductTranslation> translations = null;
        if (body.containsKey("translations")) {
            if (body.get("translations") instanceof List<?> transList) {
                translations = transList.stream().map(obj -> {
                    Map<?, ?> m = (Map<?, ?>) obj;
                    PlatformProductTranslation t = new PlatformProductTranslation();
                    t.setLanguageCode((String) m.get("languageCode"));
                    t.setCountryCode((String) m.get("countryCode"));
                    t.setName((String) m.get("name"));
                    t.setDescription((String) m.get("description"));
                    return t;
                }).toList();
            }
        }

        return ApiResponse.success(platformProductService.updateProduct(id, pp, images, translations, updatedBy));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "更新平台商品状态")
    @PreAuthorize("@perm.has('admin:catalog:edit')")
    public ApiResponse<Void> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        platformProductService.updateStatus(id, body.get("status"));
        return ApiResponse.success();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除平台商品")
    @PreAuthorize("@perm.has('admin:catalog:disable')")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        platformProductService.deleteProduct(id);
        return ApiResponse.success();
    }

    private PlatformProduct buildProductFromBody(Map<String, Object> body) {
        PlatformProduct pp = new PlatformProduct();
        if (body.get("brand") != null) pp.setBrand((String) body.get("brand"));
        if (body.get("name") != null) pp.setName((String) body.get("name"));
        if (body.get("model") != null) pp.setModel((String) body.get("model"));
        if (body.get("categoryId") != null) pp.setCategoryId(((Number) body.get("categoryId")).longValue());
        if (body.get("description") != null) pp.setDescription((String) body.get("description"));
        if (body.get("coverImage") != null) pp.setCoverImage((String) body.get("coverImage"));
        if (body.get("merchantPrice") != null) pp.setMerchantPrice(new java.math.BigDecimal(body.get("merchantPrice").toString()));
        if (body.get("salePrice") != null) pp.setSalePrice(new java.math.BigDecimal(body.get("salePrice").toString()));
        if (body.get("originalPrice") != null) pp.setOriginalPrice(new java.math.BigDecimal(body.get("originalPrice").toString()));
        if (body.get("stockMode") != null) pp.setStockMode((String) body.get("stockMode"));
        if (body.get("globalStock") != null) pp.setGlobalStock(((Number) body.get("globalStock")).intValue());
        if (body.get("sort") != null) pp.setSort(((Number) body.get("sort")).intValue());
        if (body.get("status") != null) pp.setStatus((String) body.get("status"));
        return pp;
    }
}
