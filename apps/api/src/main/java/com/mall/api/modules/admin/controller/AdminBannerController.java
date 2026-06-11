package com.mall.api.modules.admin.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.banner.BannerService;
import com.mall.api.modules.banner.entity.Banner;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/banners")
@Tag(name = "Admin Banner管理")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminBannerController {

    private final BannerService bannerService;

    public AdminBannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    @GetMapping
    @Operation(summary = "Banner列表")
    @PreAuthorize("@perm.has('product:view')")
    public ApiResponse<Map<String, Object>> getBanners(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String position,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Page<Banner> pg = bannerService.getBanners(status, position, page, pageSize);
        return ApiResponse.success(Map.of("list", pg.getRecords(), "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }

    @PostMapping
    @Operation(summary = "新增Banner")
    @PreAuthorize("@perm.has('product:banner:add')")
    public ApiResponse<Banner> createBanner(@RequestBody Banner banner) {
        return ApiResponse.success(bannerService.createBanner(banner));
    }

    @PutMapping("/{id}")
    @Operation(summary = "编辑Banner")
    @PreAuthorize("@perm.has('product:banner:edit')")
    public ApiResponse<Banner> updateBanner(@PathVariable Long id, @RequestBody Banner banner) {
        return ApiResponse.success(bannerService.updateBanner(id, banner));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "启用/禁用Banner")
    @PreAuthorize("@perm.has('product:banner:edit')")
    public ApiResponse<Void> updateBannerStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        bannerService.updateBannerStatus(id, body.get("status"));
        return ApiResponse.success();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除Banner")
    @PreAuthorize("@perm.has('product:banner:delete')")
    public ApiResponse<Void> deleteBanner(@PathVariable Long id) {
        bannerService.deleteBanner(id);
        return ApiResponse.success();
    }

    @PutMapping("/{id}/translations")
    @Operation(summary = "保存Banner翻译")
    @PreAuthorize("@perm.has('product:banner:edit')")
    public ApiResponse<Void> saveTranslations(@PathVariable Long id,
                                               @RequestBody List<Map<String, String>> translations) {
        bannerService.saveTranslations(id, translations);
        return ApiResponse.success();
    }
}
