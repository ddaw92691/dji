package com.mall.api.modules.customer.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.address.AddressService;
import com.mall.api.modules.address.entity.Address;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/addresses")
@Tag(name = "收货地址")
@PreAuthorize("isAuthenticated()")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    @Operation(summary = "获取地址列表")
    public ApiResponse<List<Address>> getAddresses() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(addressService.getAddresses(userId));
    }

    @PostMapping
    @Operation(summary = "创建地址")
    public ApiResponse<Address> createAddress(@RequestBody Address address) {
        Long userId = SecurityUtils.getCurrentUserId();
        address.setUserId(userId);
        return ApiResponse.success(addressService.createAddress(address));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新地址")
    public ApiResponse<Address> updateAddress(@PathVariable Long id, @RequestBody Address address) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(addressService.updateAddress(userId, id, address));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除地址")
    public ApiResponse<Void> deleteAddress(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        addressService.deleteAddress(userId, id);
        return ApiResponse.success();
    }

    @PutMapping("/{id}/default")
    @Operation(summary = "设为默认地址")
    public ApiResponse<Void> setDefault(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        addressService.setDefault(userId, id);
        return ApiResponse.success();
    }
}
