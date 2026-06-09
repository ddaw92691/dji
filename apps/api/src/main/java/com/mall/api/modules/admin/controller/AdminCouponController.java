package com.mall.api.modules.admin.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.coupon.CouponService;
import com.mall.api.modules.coupon.entity.Coupon;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/coupons")
@Tag(name = "管理员优惠券管理")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminCouponController {

    private final CouponService couponService;

    public AdminCouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @GetMapping
    @Operation(summary = "优惠券列表")
    public ApiResponse<Map<String, Object>> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ApiResponse.success(couponService.getCouponsAdmin(keyword, type, status, page, pageSize));
    }

    @PostMapping
    @Operation(summary = "创建优惠券")
    public ApiResponse<Coupon> create(
            @RequestBody Coupon coupon,
            @RequestParam(required = false) String translationsJson) {
        return ApiResponse.success(couponService.createCoupon(coupon, null));
    }

    @PutMapping("/{id}")
    @Operation(summary = "编辑优惠券")
    public ApiResponse<Void> update(@PathVariable Long id, @RequestBody Coupon coupon) {
        couponService.updateCoupon(id, coupon);
        return ApiResponse.success();
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "更新优惠券状态")
    public ApiResponse<Void> updateStatus(@PathVariable Long id,
                                          @RequestParam(required = false) String status,
                                          @RequestBody(required = false) Map<String, String> body) {
        if ((status == null || status.isBlank()) && body != null) {
            status = body.get("status");
        }
        couponService.updateCouponStatus(id, status);
        return ApiResponse.success();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除优惠券")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ApiResponse.success();
    }

    @GetMapping("/{couponId}/records")
    @Operation(summary = "领取记录")
    public ApiResponse<Map<String, Object>> records(
            @PathVariable Long couponId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ApiResponse.success(couponService.getCouponRecords(couponId, page, pageSize));
    }
}
