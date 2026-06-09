package com.mall.api.modules.merchant.controller;

import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/merchant")
@Tag(name = "Merchant 商家资料")
@PreAuthorize("hasRole('MERCHANT')")
public class MerchantProfileController {

    private final MerchantMapper merchantMapper;

    public MerchantProfileController(MerchantMapper merchantMapper) {
        this.merchantMapper = merchantMapper;
    }

    @GetMapping("/profile")
    @Operation(summary = "获取商家资料")
    public ApiResponse<Merchant> getProfile() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }
        Merchant merchant = merchantMapper.selectOne(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Merchant>()
                        .eq(Merchant::getUserId, userId));
        if (merchant == null) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "商家不存在");
        }
        return ApiResponse.success(merchant);
    }

    @PutMapping("/profile")
    @Operation(summary = "更新商家资料")
    @Transactional
    public ApiResponse<Void> updateProfile(@RequestBody Merchant body) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }
        Merchant merchant = merchantMapper.selectOne(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Merchant>()
                        .eq(Merchant::getUserId, userId));
        if (merchant == null) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "商家不存在");
        }
        if (body.getShopName() != null) merchant.setShopName(body.getShopName());
        if (body.getShopLogo() != null) merchant.setShopLogo(body.getShopLogo());
        if (body.getShopDesc() != null) merchant.setShopDesc(body.getShopDesc());
        merchant.setUpdatedAt(LocalDateTime.now());
        merchantMapper.updateById(merchant);
        return ApiResponse.success();
    }
}
