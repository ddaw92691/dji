package com.mall.api.modules.recharge.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.log.annotation.Audit;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.merchant.service.MerchantFundService;
import com.mall.api.modules.recharge.entity.RechargeOrder;
import com.mall.api.modules.recharge.mapper.RechargeOrderMapper;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/admin/recharges", "/api/v1/admin/recharges"})
@Tag(name = "Admin 充值记录")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminRechargeController {

    private static final String PENDING = "PENDING";
    private static final String PAID = "PAID";
    private static final String REJECTED = "REJECTED";

    private final RechargeOrderMapper rechargeMapper;
    private final MerchantMapper merchantMapper;
    private final MerchantFundService merchantFundService;

    public AdminRechargeController(RechargeOrderMapper rechargeMapper, MerchantMapper merchantMapper,
                                   MerchantFundService merchantFundService) {
        this.rechargeMapper = rechargeMapper;
        this.merchantMapper = merchantMapper;
        this.merchantFundService = merchantFundService;
    }

    @GetMapping
    @Operation(summary = "充值记录列表")
    public ApiResponse<Map<String, Object>> list(@RequestParam(required = false) String status,
                                                 @RequestParam(required = false) Long merchantId,
                                                 @RequestParam(defaultValue = "1") int page,
                                                 @RequestParam(defaultValue = "10") int pageSize) {
        LambdaQueryWrapper<RechargeOrder> qw = new LambdaQueryWrapper<RechargeOrder>()
                .eq(RechargeOrder::getDeleted, false);
        if (status != null && !status.isBlank()) {
            qw.eq(RechargeOrder::getStatus, status);
        }
        if (merchantId != null) {
            qw.eq(RechargeOrder::getMerchantId, merchantId);
        }
        qw.orderByDesc(RechargeOrder::getCreatedAt);
        Page<RechargeOrder> pg = rechargeMapper.selectPage(new Page<>(page, pageSize), qw);

        List<Map<String, Object>> list = new ArrayList<>();
        for (RechargeOrder o : pg.getRecords()) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", o.getId());
            item.put("rechargeNo", o.getRechargeNo());
            item.put("merchantId", o.getMerchantId());
            item.put("amount", o.getAmount());
            item.put("currency", o.getCurrency());
            item.put("method", o.getMethod());
            item.put("proofUrl", o.getProofUrl());
            item.put("status", o.getStatus());
            item.put("remark", o.getRemark());
            item.put("rejectReason", o.getRejectReason());
            item.put("reviewedAt", o.getReviewedAt());
            item.put("createdAt", o.getCreatedAt());
            Merchant merchant = merchantMapper.selectById(o.getMerchantId());
            item.put("shopName", merchant != null ? merchant.getShopName() : null);
            list.add(item);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("list", list);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return ApiResponse.success(result);
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "通过充值（货款入账）")
    @Audit(module = "充值记录", action = "通过充值", description = "充值审核通过并入账商家余额")
    @Transactional
    public ApiResponse<Void> approve(@PathVariable Long id, @RequestBody(required = false) Map<String, Object> body) {
        RechargeOrder order = requireOrder(id);
        if (!PENDING.equals(order.getStatus())) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "充值单不是待审核状态");
        }
        Long operatorId = SecurityUtils.getCurrentUserId();
        // 入账：增加商家可用余额并写资金流水
        merchantFundService.adjust(order.getMerchantId(), order.getAmount(), true,
                "merchant_recharge", "Recharge approved " + order.getRechargeNo(), operatorId, "RECHARGE", order.getId());

        order.setStatus(PAID);
        order.setReviewedBy(operatorId);
        order.setReviewedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        rechargeMapper.updateById(order);
        return ApiResponse.success();
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "拒绝充值")
    @Audit(module = "充值记录", action = "拒绝充值", description = "充值审核拒绝")
    public ApiResponse<Void> reject(@PathVariable Long id, @RequestBody(required = false) Map<String, Object> body) {
        RechargeOrder order = requireOrder(id);
        if (!PENDING.equals(order.getStatus())) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "充值单不是待审核状态");
        }
        order.setStatus(REJECTED);
        order.setRejectReason(body == null || body.get("rejectReason") == null
                ? null : String.valueOf(body.get("rejectReason")));
        order.setReviewedBy(SecurityUtils.getCurrentUserId());
        order.setReviewedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        rechargeMapper.updateById(order);
        return ApiResponse.success();
    }

    private RechargeOrder requireOrder(Long id) {
        RechargeOrder order = rechargeMapper.selectById(id);
        if (order == null || Boolean.TRUE.equals(order.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "充值单不存在");
        }
        return order;
    }
}
