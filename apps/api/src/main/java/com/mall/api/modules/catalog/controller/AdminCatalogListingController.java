package com.mall.api.modules.catalog.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.catalog.PlatformProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/catalog/listings")
@Tag(name = "Admin Catalog Listings")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminCatalogListingController {

    private final PlatformProductService platformProductService;

    public AdminCatalogListingController(PlatformProductService platformProductService) {
        this.platformProductService = platformProductService;
    }

    @GetMapping
    @PreAuthorize("@perm.has('admin:catalog:view')")
    public ApiResponse<Map<String, Object>> getListings(
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) Long platformProductId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String listingStatus,
            @RequestParam(required = false) String merchantKeyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        String effectiveStatus = listingStatus != null && !listingStatus.isBlank() ? listingStatus : status;
        return ApiResponse.success(platformProductService.getAdminListings(
                merchantId, platformProductId, effectiveStatus, merchantKeyword, page, pageSize));
    }

    @PutMapping("/{id}/disable")
    @PreAuthorize("@perm.has('admin:catalog:disable')")
    public ApiResponse<Void> disableListing(@PathVariable Long id) {
        platformProductService.adminDisableListing(id);
        return ApiResponse.success();
    }
}
