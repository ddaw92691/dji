package com.mall.api.modules.customer.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.coupon.CouponService;
import com.mall.api.modules.coupon.entity.UserCoupon;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer/coupons")
@Tag(name = "用户优惠券")
@PreAuthorize("isAuthenticated()")
public class CustomerCouponController {

    private final CouponService couponService;

    public CustomerCouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @GetMapping("/available")
    @Operation(summary = "可领取的优惠券")
    public ApiResponse<Map<String, Object>> getAvailableCoupons(
            @RequestParam(required = false) String countryCode,
            @RequestParam(required = false) String languageCode,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ApiResponse.success(couponService.getAvailableCoupons(countryCode, languageCode, page, pageSize));
    }

    @PostMapping("/{id}/receive")
    @Operation(summary = "领取优惠券")
    public ApiResponse<UserCoupon> receiveCoupon(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(couponService.receiveCoupon(userId, id));
    }

    @GetMapping
    @Operation(summary = "我的优惠券")
    public ApiResponse<Map<String, Object>> getMyCoupons(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(couponService.getMyCoupons(userId, status, page, pageSize));
    }

    @GetMapping("/usable")
    @Operation(summary = "当前订单可用的优惠券")
    public ApiResponse<List<Map<String, Object>>> getUsableCoupons(
            @RequestParam BigDecimal amount) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(couponService.getUsableCoupons(userId, amount));
    }
}
