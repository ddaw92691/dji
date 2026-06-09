package com.mall.api.modules.customer.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.banner.BannerService;
import com.mall.api.modules.category.CategoryService;
import com.mall.api.modules.product.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
@Tag(name = "C端接口")
public class CustomerController {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final BannerService bannerService;

    public CustomerController(ProductService productService, CategoryService categoryService,
                              BannerService bannerService) {
        this.productService = productService;
        this.categoryService = categoryService;
        this.bannerService = bannerService;
    }

    @GetMapping("/home")
    @Operation(summary = "首页数据")
    public ApiResponse<Map<String, Object>> home(
            @RequestHeader(value = "X-Country-Code", required = false) String countryCode,
            @RequestHeader(value = "X-Language-Code", required = false) String languageCode) {
        List<Map<String, Object>> banners = bannerService.getEnabledBanners(countryCode, languageCode);
        List<Map<String, Object>> categories = categoryService.getEnabledCategories(countryCode, languageCode);
        List<com.mall.api.modules.product.entity.Product> recommendedProducts =
                productService.getRecommendedProducts();
        List<com.mall.api.modules.product.entity.Product> hotProducts =
                productService.getHotProducts();
        return ApiResponse.success(Map.of(
                "banners", banners,
                "categories", categories,
                "recommendedProducts", recommendedProducts,
                "hotProducts", hotProducts
        ));
    }

    @GetMapping("/categories")
    @Operation(summary = "分类列表")
    public ApiResponse<List<Map<String, Object>>> getCategories(
            @RequestHeader(value = "X-Country-Code", required = false) String countryCode,
            @RequestHeader(value = "X-Language-Code", required = false) String languageCode) {
        return ApiResponse.success(categoryService.getEnabledCategories(countryCode, languageCode));
    }

    @GetMapping("/products")
    @Operation(summary = "商品列表")
    public ApiResponse<Map<String, Object>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false, defaultValue = "default") String sort,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestHeader(value = "X-Country-Code", required = false) String countryCode,
            @RequestHeader(value = "X-Language-Code", required = false) String languageCode) {
        List<Map<String, Object>> list = productService.getProductsWithTranslation(
                keyword, categoryId, minPrice, maxPrice, sort, page, pageSize, countryCode, languageCode);
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<com.mall.api.modules.product.entity.Product> pg =
                productService.getProducts(keyword, categoryId, minPrice, maxPrice, sort, page, pageSize);
        return ApiResponse.success(Map.of("list", list, "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }

    @GetMapping("/products/{id}")
    @Operation(summary = "商品详情")
    public ApiResponse<Map<String, Object>> getProductDetail(
            @PathVariable Long id,
            @RequestHeader(value = "X-Country-Code", required = false) String countryCode,
            @RequestHeader(value = "X-Language-Code", required = false) String languageCode) {
        Map<String, Object> detail = productService.getProductDetail(id, countryCode, languageCode);
        if (detail == null) {
            return ApiResponse.error(404, "商品不存在");
        }
        return ApiResponse.success(detail);
    }
}
