package com.mall.api.modules.merchant.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.entity.MerchantFundLog;
import com.mall.api.modules.merchant.mapper.MerchantFundLogMapper;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class MerchantFundService {

    private final MerchantMapper merchantMapper;
    private final MerchantFundLogMapper fundLogMapper;

    public MerchantFundService(MerchantMapper merchantMapper, MerchantFundLogMapper fundLogMapper) {
        this.merchantMapper = merchantMapper;
        this.fundLogMapper = fundLogMapper;
    }

    /**
     * 调整商家可用余额并记录流水。amount 必须为正数，increase=true 增加，false 扣减。
     */
    @Transactional
    public MerchantFundLog adjust(Long merchantId, BigDecimal amount, boolean increase,
                                  String type, String remark, Long operatorId,
                                  String refType, Long refId) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "金额必须大于0");
        }
        Merchant merchant = merchantMapper.selectById(merchantId);
        if (merchant == null || Boolean.TRUE.equals(merchant.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "商家不存在");
        }

        BigDecimal before = merchant.getBalance() != null ? merchant.getBalance() : BigDecimal.ZERO;
        BigDecimal frozenBefore = merchant.getFrozenBalance() != null ? merchant.getFrozenBalance() : BigDecimal.ZERO;
        BigDecimal after;
        if (increase) {
            merchantMapper.increaseBalance(merchantId, amount);
            after = before.add(amount);
        } else {
            int rows = merchantMapper.decreaseBalance(merchantId, amount);
            if (rows == 0) {
                throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "商家可用余额不足");
            }
            after = before.subtract(amount);
        }

        MerchantFundLog log = new MerchantFundLog();
        log.setMerchantId(merchantId);
        log.setType(type);
        log.setAmount(amount);
        log.setBalanceBefore(before);
        log.setBalanceAfter(after);
        log.setFrozenBalanceBefore(frozenBefore);
        log.setFrozenBalanceAfter(frozenBefore);
        log.setRefType(refType);
        log.setRefId(refId);
        applyRelatedIds(log, refType, refId);
        log.setRemark(remark);
        log.setReason(remark);
        log.setOperatorType(operatorId == null ? "SYSTEM" : "ADMIN");
        log.setOperatorId(operatorId);
        log.setCreatedAt(LocalDateTime.now());
        fundLogMapper.insert(log);
        return log;
    }

    @Transactional
    public MerchantFundLog freeze(Long merchantId, BigDecimal amount, String type, String reason,
                                  Long operatorId, String refType, Long refId) {
        Merchant merchant = requireMerchant(merchantId);
        validateAmount(amount);
        BigDecimal before = safe(merchant.getBalance());
        BigDecimal frozenBefore = safe(merchant.getFrozenBalance());
        int rows = merchantMapper.freezeBalance(merchantId, amount);
        if (rows == 0) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Merchant available balance is not enough");
        }
        return insertLog(merchantId, type, amount, before, before.subtract(amount),
                frozenBefore, frozenBefore.add(amount), reason, operatorId, refType, refId);
    }

    @Transactional
    public MerchantFundLog unfreeze(Long merchantId, BigDecimal amount, String type, String reason,
                                    Long operatorId, String refType, Long refId) {
        Merchant merchant = requireMerchant(merchantId);
        validateAmount(amount);
        BigDecimal before = safe(merchant.getBalance());
        BigDecimal frozenBefore = safe(merchant.getFrozenBalance());
        int rows = merchantMapper.unfreezeBalance(merchantId, amount);
        if (rows == 0) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Merchant frozen balance is not enough");
        }
        return insertLog(merchantId, type, amount, before, before.add(amount),
                frozenBefore, frozenBefore.subtract(amount), reason, operatorId, refType, refId);
    }

    public Page<MerchantFundLog> getFundLogs(Long merchantId, int page, int pageSize) {
        LambdaQueryWrapper<MerchantFundLog> qw = new LambdaQueryWrapper<>();
        qw.eq(MerchantFundLog::getMerchantId, merchantId)
                .orderByDesc(MerchantFundLog::getCreatedAt);
        return fundLogMapper.selectPage(new Page<>(page, pageSize), qw);
    }

    public Map<String, Object> walletSummary(Long merchantId) {
        Merchant merchant = requireMerchant(merchantId);
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("merchantId", merchantId);
        summary.put("availableBalance", safe(merchant.getBalance()));
        summary.put("frozenBalance", safe(merchant.getFrozenBalance()));
        summary.put("status", merchant.getStatus());

        List<MerchantFundLog> logs = fundLogMapper.selectList(new LambdaQueryWrapper<MerchantFundLog>()
                .eq(MerchantFundLog::getMerchantId, merchantId));
        summary.put("totalRecharge", sumByTypes(logs, "merchant_recharge", "RECHARGE"));
        summary.put("totalWithdraw", sumByTypes(logs, "withdraw", "WITHDRAW"));
        summary.put("totalPurchasePayment", sumByTypes(logs, "purchase_payment", "ORDER_PAY"));
        summary.put("totalProfit", sumByTypes(logs, "order_settlement", "SETTLE"));
        summary.put("totalSettlement", sumByTypes(logs, "order_settlement", "SETTLE"));
        return summary;
    }

    private MerchantFundLog insertLog(Long merchantId, String type, BigDecimal amount,
                                      BigDecimal before, BigDecimal after,
                                      BigDecimal frozenBefore, BigDecimal frozenAfter,
                                      String reason, Long operatorId, String refType, Long refId) {
        MerchantFundLog log = new MerchantFundLog();
        log.setMerchantId(merchantId);
        log.setType(type);
        log.setAmount(amount);
        log.setBalanceBefore(before);
        log.setBalanceAfter(after);
        log.setFrozenBalanceBefore(frozenBefore);
        log.setFrozenBalanceAfter(frozenAfter);
        log.setRefType(refType);
        log.setRefId(refId);
        applyRelatedIds(log, refType, refId);
        log.setRemark(reason);
        log.setReason(reason);
        log.setOperatorType(operatorId == null ? "SYSTEM" : "ADMIN");
        log.setOperatorId(operatorId);
        log.setCreatedAt(LocalDateTime.now());
        fundLogMapper.insert(log);
        return log;
    }

    private Merchant requireMerchant(Long merchantId) {
        Merchant merchant = merchantMapper.selectById(merchantId);
        if (merchant == null || Boolean.TRUE.equals(merchant.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "Merchant not found");
        }
        return merchant;
    }

    private void validateAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Amount must be greater than 0");
        }
    }

    private BigDecimal safe(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private BigDecimal sumByTypes(List<MerchantFundLog> logs, String... types) {
        BigDecimal total = BigDecimal.ZERO;
        for (MerchantFundLog log : logs) {
            if (log.getType() == null || log.getAmount() == null) continue;
            for (String type : types) {
                if (type.equalsIgnoreCase(log.getType())) {
                    total = total.add(log.getAmount());
                    break;
                }
            }
        }
        return total;
    }

    private void applyRelatedIds(MerchantFundLog log, String refType, Long refId) {
        if (refType == null || refId == null) return;
        if ("ORDER".equalsIgnoreCase(refType)) {
            log.setRelatedOrderId(refId);
        } else if ("RECHARGE".equalsIgnoreCase(refType)) {
            log.setRelatedRechargeId(refId);
        }
    }
}
