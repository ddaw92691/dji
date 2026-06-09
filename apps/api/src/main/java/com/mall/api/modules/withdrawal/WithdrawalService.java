package com.mall.api.modules.withdrawal;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.modules.agent.entity.Agent;
import com.mall.api.modules.agent.mapper.AgentMapper;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.notification.NotificationService;
import com.mall.api.modules.system.SystemSettingService;
import com.mall.api.modules.withdrawal.entity.Withdrawal;
import com.mall.api.modules.withdrawal.mapper.WithdrawalMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class WithdrawalService {

    private final WithdrawalMapper withdrawalMapper;
    private final MerchantMapper merchantMapper;
    private final AgentMapper agentMapper;
    private final SystemSettingService systemSettingService;
    private final NotificationService notificationService;

    public WithdrawalService(WithdrawalMapper withdrawalMapper, MerchantMapper merchantMapper,
                             AgentMapper agentMapper, SystemSettingService systemSettingService,
                             NotificationService notificationService) {
        this.withdrawalMapper = withdrawalMapper;
        this.merchantMapper = merchantMapper;
        this.agentMapper = agentMapper;
        this.systemSettingService = systemSettingService;
        this.notificationService = notificationService;
    }

    @Transactional
    public Withdrawal applyWithdrawal(Long userId, String role, BigDecimal amount, String bankName,
                                       String bankAccount, String accountName, String remark) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(400, "提现金额必须大于0");
        }

        BigDecimal minAmount;
        if ("MERCHANT".equals(role)) {
            minAmount = systemSettingService.getMinMerchantWithdrawal();
            LambdaQueryWrapper<Merchant> wrapper = Wrappers.<Merchant>lambdaQuery()
                    .eq(Merchant::getUserId, userId);
            Merchant merchant = merchantMapper.selectOne(wrapper);
            if (merchant == null) {
                throw new BusinessException(400, "商家信息不存在");
            }
            if (amount.compareTo(minAmount) < 0) {
                throw new BusinessException(400, "提现金额不能低于" + minAmount);
            }

            int rows = merchantMapper.freezeForWithdrawal(userId, amount);
            if (rows == 0) {
                throw new BusinessException(400, "余额不足");
            }
        } else if ("AGENT".equals(role)) {
            minAmount = systemSettingService.getMinAgentWithdrawal();
            LambdaQueryWrapper<Agent> wrapper = Wrappers.<Agent>lambdaQuery()
                    .eq(Agent::getUserId, userId);
            Agent agent = agentMapper.selectOne(wrapper);
            if (agent == null) {
                throw new BusinessException(400, "代理信息不存在");
            }
            if (amount.compareTo(minAmount) < 0) {
                throw new BusinessException(400, "提现金额不能低于" + minAmount);
            }

            int rows = agentMapper.freezeForWithdrawal(userId, amount);
            if (rows == 0) {
                throw new BusinessException(400, "余额不足");
            }
        } else {
            throw new BusinessException(400, "不支持的角色类型");
        }

        Withdrawal withdrawal = new Withdrawal();
        withdrawal.setUserId(userId);
        withdrawal.setRole(role);
        withdrawal.setType(role.equals("MERCHANT") ? "MERCHANT_BALANCE" : "AGENT_BALANCE");
        withdrawal.setUserType(role);
        withdrawal.setAmount(amount);
        withdrawal.setFee(BigDecimal.ZERO);
        withdrawal.setActualAmount(amount);
        withdrawal.setCurrency("JPY");
        withdrawal.setBankName(bankName);
        withdrawal.setBankAccount(bankAccount);
        withdrawal.setAccountName(accountName);
        withdrawal.setMethod("BANK_TRANSFER");
        withdrawal.setRemark(remark);
        withdrawal.setStatus("PENDING");
        withdrawal.setCreatedAt(LocalDateTime.now());
        withdrawal.setUpdatedAt(LocalDateTime.now());
        withdrawalMapper.insert(withdrawal);

        return withdrawal;
    }

    @Transactional
    public Withdrawal approveWithdrawal(Long withdrawalId, Long reviewerUserId) {
        Withdrawal withdrawal = withdrawalMapper.selectById(withdrawalId);
        if (withdrawal == null) {
            throw new BusinessException(400, "提现记录不存在");
        }
        if (!"PENDING".equals(withdrawal.getStatus())) {
            throw new BusinessException(400, "只能审批待处理状态的提现");
        }

        if ("MERCHANT".equals(withdrawal.getRole())) {
            LambdaQueryWrapper<Merchant> wrapper = Wrappers.<Merchant>lambdaQuery()
                    .eq(Merchant::getUserId, withdrawal.getUserId());
            Merchant merchant = merchantMapper.selectOne(wrapper);
            if (merchant != null) {
                BigDecimal frozenBalance = merchant.getFrozenBalance() != null
                        ? merchant.getFrozenBalance() : BigDecimal.ZERO;
                BigDecimal totalWithdrawn = merchant.getTotalWithdrawn() != null
                        ? merchant.getTotalWithdrawn() : BigDecimal.ZERO;

                merchant.setFrozenBalance(frozenBalance.subtract(withdrawal.getAmount()));
                merchant.setTotalWithdrawn(totalWithdrawn.add(withdrawal.getAmount()));
                merchant.setUpdatedAt(LocalDateTime.now());
                merchantMapper.updateById(merchant);
            }
        } else if ("AGENT".equals(withdrawal.getRole())) {
            LambdaQueryWrapper<Agent> wrapper = Wrappers.<Agent>lambdaQuery()
                    .eq(Agent::getUserId, withdrawal.getUserId());
            Agent agent = agentMapper.selectOne(wrapper);
            if (agent != null) {
                BigDecimal frozenBalance = agent.getFrozenBalance() != null
                        ? agent.getFrozenBalance() : BigDecimal.ZERO;
                BigDecimal totalWithdrawn = agent.getTotalWithdrawn() != null
                        ? agent.getTotalWithdrawn() : BigDecimal.ZERO;

                agent.setFrozenBalance(frozenBalance.subtract(withdrawal.getAmount()));
                agent.setTotalWithdrawn(totalWithdrawn.add(withdrawal.getAmount()));
                agent.setUpdatedAt(LocalDateTime.now());
                agentMapper.updateById(agent);
            }
        }

        withdrawal.setStatus("APPROVED");
        withdrawal.setReviewedBy(reviewerUserId);
        withdrawal.setReviewedAt(LocalDateTime.now());
        withdrawal.setUpdatedAt(LocalDateTime.now());
        withdrawalMapper.updateById(withdrawal);

        notificationService.createNotification(withdrawal.getUserId(), withdrawal.getRole(),
                "Withdrawal approved",
                "Your withdrawal of " + withdrawal.getAmount() + " " + withdrawal.getCurrency() + " has been approved.",
                "WITHDRAWAL_APPROVED", "withdrawal", withdrawalId);

        return withdrawal;
    }

    @Transactional
    public Withdrawal rejectWithdrawal(Long withdrawalId, Long reviewerUserId, String rejectReason) {
        Withdrawal withdrawal = withdrawalMapper.selectById(withdrawalId);
        if (withdrawal == null) {
            throw new BusinessException(400, "提现记录不存在");
        }
        if (!"PENDING".equals(withdrawal.getStatus())) {
            throw new BusinessException(400, "只能拒绝待处理状态的提现");
        }

        if ("MERCHANT".equals(withdrawal.getRole())) {
            LambdaQueryWrapper<Merchant> wrapper = Wrappers.<Merchant>lambdaQuery()
                    .eq(Merchant::getUserId, withdrawal.getUserId());
            Merchant merchant = merchantMapper.selectOne(wrapper);
            if (merchant != null) {
                BigDecimal frozenBalance = merchant.getFrozenBalance() != null
                        ? merchant.getFrozenBalance() : BigDecimal.ZERO;
                BigDecimal balance = merchant.getBalance() != null
                        ? merchant.getBalance() : BigDecimal.ZERO;

                merchant.setFrozenBalance(frozenBalance.subtract(withdrawal.getAmount()));
                merchant.setBalance(balance.add(withdrawal.getAmount()));
                merchant.setUpdatedAt(LocalDateTime.now());
                merchantMapper.updateById(merchant);
            }
        } else if ("AGENT".equals(withdrawal.getRole())) {
            LambdaQueryWrapper<Agent> wrapper = Wrappers.<Agent>lambdaQuery()
                    .eq(Agent::getUserId, withdrawal.getUserId());
            Agent agent = agentMapper.selectOne(wrapper);
            if (agent != null) {
                BigDecimal frozenBalance = agent.getFrozenBalance() != null
                        ? agent.getFrozenBalance() : BigDecimal.ZERO;
                BigDecimal balance = agent.getBalance() != null
                        ? agent.getBalance() : BigDecimal.ZERO;

                agent.setFrozenBalance(frozenBalance.subtract(withdrawal.getAmount()));
                agent.setBalance(balance.add(withdrawal.getAmount()));
                agent.setUpdatedAt(LocalDateTime.now());
                agentMapper.updateById(agent);
            }
        }

        withdrawal.setStatus("REJECTED");
        withdrawal.setRejectReason(rejectReason);
        withdrawal.setReviewedBy(reviewerUserId);
        withdrawal.setReviewedAt(LocalDateTime.now());
        withdrawal.setUpdatedAt(LocalDateTime.now());
        withdrawalMapper.updateById(withdrawal);

        notificationService.createNotification(withdrawal.getUserId(), withdrawal.getRole(),
                "Withdrawal rejected",
                "Your withdrawal of " + withdrawal.getAmount() + " " + withdrawal.getCurrency() + " has been rejected" +
                        (rejectReason != null ? ": " + rejectReason : ""),
                "WITHDRAWAL_REJECTED", "withdrawal", withdrawalId);

        return withdrawal;
    }

    public Map<String, Object> getWithdrawals(Long userId, String status, int page, int pageSize) {
        LambdaQueryWrapper<Withdrawal> wrapper = Wrappers.<Withdrawal>lambdaQuery()
                .eq(Withdrawal::getUserId, userId)
                .eq(status != null && !status.isBlank(), Withdrawal::getStatus, status)
                .orderByDesc(Withdrawal::getCreatedAt);

        Page<Withdrawal> pg = withdrawalMapper.selectPage(new Page<>(page, pageSize), wrapper);

        Map<String, Object> result = new HashMap<>();
        result.put("list", pg.getRecords());
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public Map<String, Object> getWithdrawalsAdmin(String keyword, String role, String type, String status,
                                                    String startDate, String endDate,
                                                    int page, int pageSize) {
        LambdaQueryWrapper<Withdrawal> wrapper = Wrappers.<Withdrawal>lambdaQuery()
                .eq(role != null && !role.isBlank(), Withdrawal::getRole, role)
                .eq(type != null && !type.isBlank(), Withdrawal::getType, type)
                .eq(status != null && !status.isBlank(), Withdrawal::getStatus, status)
                .ge(startDate != null && !startDate.isBlank(), Withdrawal::getCreatedAt, startDate)
                .le(endDate != null && !endDate.isBlank(), Withdrawal::getCreatedAt, endDate)
                .orderByDesc(Withdrawal::getCreatedAt);

        if (keyword != null && !keyword.isBlank()) {
            try {
                Long userId = Long.parseLong(keyword);
                wrapper.eq(Withdrawal::getUserId, userId);
            } catch (NumberFormatException e) {
                wrapper.and(w -> w.like(Withdrawal::getBankAccount, keyword)
                        .or().like(Withdrawal::getAccountName, keyword));
            }
        }

        Page<Withdrawal> pg = withdrawalMapper.selectPage(new Page<>(page, pageSize), wrapper);

        Map<String, Object> result = new HashMap<>();
        result.put("list", pg.getRecords());
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public Withdrawal getWithdrawalDetail(Long id) {
        Withdrawal withdrawal = withdrawalMapper.selectById(id);
        if (withdrawal == null) {
            throw new BusinessException(400, "提现记录不存在");
        }
        return withdrawal;
    }
}
