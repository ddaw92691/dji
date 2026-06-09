package com.mall.api.modules.finance;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mall.api.modules.agent.entity.Agent;
import com.mall.api.modules.agent.mapper.AgentMapper;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.order.entity.MallOrder;
import com.mall.api.modules.order.mapper.MallOrderMapper;
import com.mall.api.modules.payment.entity.Payment;
import com.mall.api.modules.payment.mapper.PaymentMapper;
import com.mall.api.modules.user.mapper.UserMapper;
import com.mall.api.modules.withdrawal.entity.Withdrawal;
import com.mall.api.modules.withdrawal.mapper.WithdrawalMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class FinanceService {

    private final MerchantMapper merchantMapper;
    private final AgentMapper agentMapper;
    private final UserMapper userMapper;
    private final MallOrderMapper orderMapper;
    private final PaymentMapper paymentMapper;
    private final WithdrawalMapper withdrawalMapper;

    public FinanceService(MerchantMapper merchantMapper, AgentMapper agentMapper,
                          UserMapper userMapper, MallOrderMapper orderMapper,
                          PaymentMapper paymentMapper, WithdrawalMapper withdrawalMapper) {
        this.merchantMapper = merchantMapper;
        this.agentMapper = agentMapper;
        this.userMapper = userMapper;
        this.orderMapper = orderMapper;
        this.paymentMapper = paymentMapper;
        this.withdrawalMapper = withdrawalMapper;
    }

    public Map<String, Object> getMerchantSummary(Long userId) {
        LambdaQueryWrapper<Merchant> wrapper = Wrappers.<Merchant>lambdaQuery()
                .eq(Merchant::getUserId, userId);
        Merchant merchant = merchantMapper.selectOne(wrapper);

        Map<String, Object> summary = new HashMap<>();
        summary.put("balance", merchant != null && merchant.getBalance() != null
                ? merchant.getBalance() : BigDecimal.ZERO);
        summary.put("frozenBalance", merchant != null && merchant.getFrozenBalance() != null
                ? merchant.getFrozenBalance() : BigDecimal.ZERO);
        summary.put("totalSales", merchant != null && merchant.getTotalSales() != null
                ? merchant.getTotalSales() : BigDecimal.ZERO);
        summary.put("totalWithdrawn", merchant != null && merchant.getTotalWithdrawn() != null
                ? merchant.getTotalWithdrawn() : BigDecimal.ZERO);
        summary.put("shopName", merchant != null ? merchant.getShopName() : null);

        Long pendingWithdrawalCount = withdrawalMapper.selectCount(
                Wrappers.<Withdrawal>lambdaQuery()
                        .eq(Withdrawal::getUserId, userId)
                        .eq(Withdrawal::getStatus, "PENDING"));
        summary.put("pendingWithdrawals", pendingWithdrawalCount);

        return summary;
    }

    public Map<String, Object> getAgentSummary(Long userId) {
        LambdaQueryWrapper<Agent> wrapper = Wrappers.<Agent>lambdaQuery()
                .eq(Agent::getUserId, userId);
        Agent agent = agentMapper.selectOne(wrapper);

        Map<String, Object> summary = new HashMap<>();
        summary.put("balance", agent != null && agent.getBalance() != null
                ? agent.getBalance() : BigDecimal.ZERO);
        summary.put("frozenBalance", agent != null && agent.getFrozenBalance() != null
                ? agent.getFrozenBalance() : BigDecimal.ZERO);
        summary.put("totalCommission", agent != null && agent.getTotalCommission() != null
                ? agent.getTotalCommission() : BigDecimal.ZERO);
        summary.put("totalWithdrawn", agent != null && agent.getTotalWithdrawn() != null
                ? agent.getTotalWithdrawn() : BigDecimal.ZERO);
        summary.put("commissionRate", agent != null && agent.getCommissionRate() != null
                ? agent.getCommissionRate() : BigDecimal.ZERO);

        Long pendingWithdrawalCount = withdrawalMapper.selectCount(
                Wrappers.<Withdrawal>lambdaQuery()
                        .eq(Withdrawal::getUserId, userId)
                        .eq(Withdrawal::getStatus, "PENDING"));
        summary.put("pendingWithdrawals", pendingWithdrawalCount);

        return summary;
    }

    public Map<String, Object> getAdminOverview() {
        Map<String, Object> overview = new HashMap<>();

        Long totalUsers = userMapper.selectCount(null);
        Long totalOrders = orderMapper.selectCount(
                Wrappers.<MallOrder>lambdaQuery().eq(MallOrder::getDeleted, false));
        Long totalPaidOrders = orderMapper.selectCount(
                Wrappers.<MallOrder>lambdaQuery()
                        .eq(MallOrder::getDeleted, false)
                        .eq(MallOrder::getPayStatus, "PAID"));

        BigDecimal totalRevenue = BigDecimal.ZERO;
        LambdaQueryWrapper<Payment> payWrapper = Wrappers.<Payment>lambdaQuery()
                .eq(Payment::getStatus, "SUCCESS");
        for (Payment p : paymentMapper.selectList(payWrapper)) {
            if (p.getAmount() != null) {
                totalRevenue = totalRevenue.add(p.getAmount());
            }
        }
        overview.put("totalRevenue", totalRevenue);

        Long pendingWithdrawals = withdrawalMapper.selectCount(
                Wrappers.<Withdrawal>lambdaQuery().eq(Withdrawal::getStatus, "PENDING"));
        overview.put("pendingWithdrawals", pendingWithdrawals);

        Long totalMerchants = merchantMapper.selectCount(
                Wrappers.<Merchant>lambdaQuery().eq(Merchant::getStatus, "ENABLE"));
        Long totalAgents = agentMapper.selectCount(
                Wrappers.<Agent>lambdaQuery().eq(Agent::getStatus, "ENABLE"));

        overview.put("totalUsers", totalUsers);
        overview.put("totalOrders", totalOrders);
        overview.put("totalPaidOrders", totalPaidOrders);
        overview.put("totalMerchants", totalMerchants);
        overview.put("totalAgents", totalAgents);

        return overview;
    }
}
