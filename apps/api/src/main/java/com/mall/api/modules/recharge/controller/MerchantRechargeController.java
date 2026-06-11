package com.mall.api.modules.recharge.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.recharge.entity.RechargeOrder;
import com.mall.api.modules.recharge.mapper.RechargeOrderMapper;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequestMapping({"/api/merchant/recharges", "/api/v1/merchant/recharges"})
@Tag(name = "商家充值")
@PreAuthorize("hasRole('MERCHANT')")
public class MerchantRechargeController {

    private final RechargeOrderMapper rechargeMapper;
    private final MerchantMapper merchantMapper;

    public MerchantRechargeController(RechargeOrderMapper rechargeMapper, MerchantMapper merchantMapper) {
        this.rechargeMapper = rechargeMapper;
        this.merchantMapper = merchantMapper;
    }

    @GetMapping
    @Operation(summary = "我的充值记录")
    public ApiResponse<Map<String, Object>> list(@RequestParam(required = false) String status,
                                                 @RequestParam(defaultValue = "1") int page,
                                                 @RequestParam(defaultValue = "10") int pageSize) {
        Merchant merchant = currentMerchant();
        LambdaQueryWrapper<RechargeOrder> qw = new LambdaQueryWrapper<RechargeOrder>()
                .eq(RechargeOrder::getMerchantId, merchant.getId())
                .eq(RechargeOrder::getDeleted, false);
        if (status != null && !status.isBlank()) {
            qw.eq(RechargeOrder::getStatus, status);
        }
        qw.orderByDesc(RechargeOrder::getCreatedAt);
        Page<RechargeOrder> pg = rechargeMapper.selectPage(new Page<>(page, pageSize), qw);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("list", pg.getRecords());
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return ApiResponse.success(result);
    }

    @PostMapping
    @Operation(summary = "提交充值申请")
    public ApiResponse<RechargeOrder> submit(@RequestBody Map<String, Object> body) {
        Merchant merchant = currentMerchant();
        BigDecimal amount;
        try {
            amount = new BigDecimal(String.valueOf(body.get("amount")).trim());
        } catch (Exception e) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "金额格式不正确");
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "充值金额必须大于0");
        }
        String proofUrl = text(body, "proofUrl", null);
        if (proofUrl == null || proofUrl.isBlank()) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Payment proof is required");
        }

        RechargeOrder order = new RechargeOrder();
        order.setRechargeNo(generateNo());
        order.setMerchantId(merchant.getId());
        order.setUserId(merchant.getUserId());
        order.setAmount(amount);
        order.setCurrency(text(body, "currency", "JPY"));
        order.setMethod(text(body, "method", null));
        order.setProofUrl(proofUrl);
        order.setRemark(text(body, "remark", null));
        order.setStatus("PENDING");
        order.setDeleted(false);
        LocalDateTime now = LocalDateTime.now();
        order.setCreatedAt(now);
        order.setUpdatedAt(now);
        rechargeMapper.insert(order);
        return ApiResponse.success(order);
    }

    private String generateNo() {
        return "RC" + System.currentTimeMillis() + ThreadLocalRandom.current().nextInt(100, 1000);
    }

    private String text(Map<String, Object> body, String key, String def) {
        Object v = body.get(key);
        if (v == null) return def;
        String s = String.valueOf(v).trim();
        return s.isEmpty() ? def : s;
    }

    private Merchant currentMerchant() {
        Long userId = SecurityUtils.getCurrentUserId();
        Merchant merchant = userId == null ? null : merchantMapper.selectByUserId(userId);
        if (merchant == null) {
            throw new BusinessException(ResultCode.FORBIDDEN.getCode(), "Merchant profile not found");
        }
        return merchant;
    }
}
