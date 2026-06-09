package com.mall.api.modules.dashboard.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.agent.entity.Agent;
import com.mall.api.modules.agent.mapper.AgentMapper;
import com.mall.api.modules.commission.entity.Commission;
import com.mall.api.modules.commission.mapper.CommissionMapper;
import com.mall.api.modules.customer.entity.CustomerProfile;
import com.mall.api.modules.customer.mapper.CustomerProfileMapper;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.order.entity.MallOrder;
import com.mall.api.modules.order.mapper.MallOrderMapper;
import com.mall.api.modules.payment.entity.Payment;
import com.mall.api.modules.payment.mapper.PaymentMapper;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/merchant/dashboard")
@Tag(name = "商家/代理仪表盘")
@PreAuthorize("hasAnyRole('MERCHANT','AGENT')")
public class MerchantDashboardController {

    private final MallOrderMapper orderMapper;
    private final MerchantMapper merchantMapper;
    private final AgentMapper agentMapper;
    private final CommissionMapper commissionMapper;
    private final CustomerProfileMapper customerProfileMapper;
    private final PaymentMapper paymentMapper;

    public MerchantDashboardController(MallOrderMapper orderMapper, MerchantMapper merchantMapper,
                                       AgentMapper agentMapper, CommissionMapper commissionMapper,
                                       CustomerProfileMapper customerProfileMapper,
                                       PaymentMapper paymentMapper) {
        this.orderMapper = orderMapper;
        this.merchantMapper = merchantMapper;
        this.agentMapper = agentMapper;
        this.commissionMapper = commissionMapper;
        this.customerProfileMapper = customerProfileMapper;
        this.paymentMapper = paymentMapper;
    }

    @GetMapping
    @Operation(summary = "商家/代理仪表盘")
    public ApiResponse<Map<String, Object>> dashboard() {
        Long userId = SecurityUtils.getCurrentUserId();
        boolean isMerchant = SecurityUtils.hasRole("MERCHANT");
        boolean isAgent = SecurityUtils.hasRole("AGENT");

        Map<String, Object> data = new HashMap<>();

        if (isMerchant) {
            Merchant merchant = merchantMapper.selectOne(
                    Wrappers.<Merchant>lambdaQuery().eq(Merchant::getUserId, userId));

            Long totalOrders = orderMapper.selectCount(
                    Wrappers.<MallOrder>lambdaQuery()
                            .eq(MallOrder::getMerchantId, userId)
                            .eq(MallOrder::getDeleted, false));

            Long todayOrders = orderMapper.selectCount(
                    Wrappers.<MallOrder>lambdaQuery()
                            .eq(MallOrder::getMerchantId, userId)
                            .eq(MallOrder::getDeleted, false)
                            .ge(MallOrder::getCreatedAt, LocalDate.now().atStartOfDay()));

            BigDecimal balance = BigDecimal.ZERO;
            BigDecimal frozenBalance = BigDecimal.ZERO;
            BigDecimal totalSales = BigDecimal.ZERO;
            if (merchant != null) {
                balance = merchant.getBalance() != null ? merchant.getBalance() : BigDecimal.ZERO;
                frozenBalance = merchant.getFrozenBalance() != null ? merchant.getFrozenBalance() : BigDecimal.ZERO;
                totalSales = merchant.getTotalSales() != null ? merchant.getTotalSales() : BigDecimal.ZERO;
            }

            data.put("balance", balance);
            data.put("frozenBalance", frozenBalance);
            data.put("totalSales", totalSales);
            data.put("totalOrders", totalOrders);
            data.put("todayOrders", todayOrders);
        }

        if (isAgent) {
            Agent agent = agentMapper.selectOne(
                    Wrappers.<Agent>lambdaQuery().eq(Agent::getUserId, userId));

            Long customerCount = customerProfileMapper.selectCount(
                    Wrappers.<CustomerProfile>lambdaQuery().eq(CustomerProfile::getInvitedBy, userId));

            BigDecimal balance = BigDecimal.ZERO;
            BigDecimal frozenBalance = BigDecimal.ZERO;
            BigDecimal totalCommission = BigDecimal.ZERO;
            if (agent != null) {
                balance = agent.getBalance() != null ? agent.getBalance() : BigDecimal.ZERO;
                frozenBalance = agent.getFrozenBalance() != null ? agent.getFrozenBalance() : BigDecimal.ZERO;
                totalCommission = agent.getTotalCommission() != null ? agent.getTotalCommission() : BigDecimal.ZERO;
            }

            Long pendingCommissionCount = commissionMapper.selectCount(
                    Wrappers.<Commission>lambdaQuery()
                            .eq(agent != null, Commission::getAgentId, agent != null ? agent.getId() : null)
                            .eq(Commission::getStatus, "FROZEN"));

            data.put("balance", balance);
            data.put("frozenBalance", frozenBalance);
            data.put("totalCommission", totalCommission);
            data.put("customerCount", customerCount);
            data.put("pendingCommissions", pendingCommissionCount);
        }

        return ApiResponse.success(data);
    }

    @GetMapping("/charts")
    @Operation(summary = "商家/代理图表数据")
    public ApiResponse<Map<String, Object>> charts() {
        Long userId = SecurityUtils.getCurrentUserId();
        boolean isMerchant = SecurityUtils.hasRole("MERCHANT");

        Map<String, Object> data = new HashMap<>();
        LocalDate today = LocalDate.now();

        if (isMerchant) {
            List<Map<String, Object>> salesTrend = new ArrayList<>();
            List<Map<String, Object>> orderTrend = new ArrayList<>();

            for (int i = 6; i >= 0; i--) {
                LocalDate date = today.minusDays(i);
                String dateStr = date.toString();

                List<Payment> dayPayments = paymentMapper.selectList(
                        Wrappers.<Payment>lambdaQuery()
                                .eq(Payment::getStatus, "SUCCESS")
                                .ge(Payment::getPaidAt, date.atStartOfDay())
                                .le(Payment::getPaidAt, date.atTime(23, 59, 59)));
                BigDecimal daySales = BigDecimal.ZERO;
                for (Payment p : dayPayments) {
                    if (p.getAmount() != null) {
                        daySales = daySales.add(p.getAmount());
                    }
                }
                Map<String, Object> sp = new HashMap<>();
                sp.put("date", dateStr);
                sp.put("amount", daySales);
                salesTrend.add(sp);

                Long dayOrders = orderMapper.selectCount(
                        Wrappers.<MallOrder>lambdaQuery()
                                .eq(MallOrder::getMerchantId, userId)
                                .eq(MallOrder::getDeleted, false)
                                .ge(MallOrder::getCreatedAt, date.atStartOfDay())
                                .le(MallOrder::getCreatedAt, date.atTime(23, 59, 59)));
                Map<String, Object> op = new HashMap<>();
                op.put("date", dateStr);
                op.put("count", dayOrders);
                orderTrend.add(op);
            }

            Long pendingPayment = orderMapper.selectCount(
                    Wrappers.<MallOrder>lambdaQuery()
                            .eq(MallOrder::getMerchantId, userId)
                            .eq(MallOrder::getDeleted, false)
                            .eq(MallOrder::getStatus, "PENDING_PAYMENT"));
            Long paid = orderMapper.selectCount(
                    Wrappers.<MallOrder>lambdaQuery()
                            .eq(MallOrder::getMerchantId, userId)
                            .eq(MallOrder::getDeleted, false)
                            .eq(MallOrder::getStatus, "PAID"));
            Long shipped = orderMapper.selectCount(
                    Wrappers.<MallOrder>lambdaQuery()
                            .eq(MallOrder::getMerchantId, userId)
                            .eq(MallOrder::getDeleted, false)
                            .eq(MallOrder::getStatus, "SHIPPED"));
            Long completed = orderMapper.selectCount(
                    Wrappers.<MallOrder>lambdaQuery()
                            .eq(MallOrder::getMerchantId, userId)
                            .eq(MallOrder::getDeleted, false)
                            .eq(MallOrder::getStatus, "COMPLETED"));

            List<Map<String, Object>> orderStatusDistribution = new ArrayList<>();
            orderStatusDistribution.add(Map.of("name", "Pending Payment", "value", pendingPayment));
            orderStatusDistribution.add(Map.of("name", "Paid", "value", paid));
            orderStatusDistribution.add(Map.of("name", "Shipped", "value", shipped));
            orderStatusDistribution.add(Map.of("name", "Completed", "value", completed));

            data.put("salesTrend", salesTrend);
            data.put("orderTrend", orderTrend);
            data.put("orderStatusDistribution", orderStatusDistribution);
        } else {
            Agent agent = agentMapper.selectOne(
                    Wrappers.<Agent>lambdaQuery().eq(Agent::getUserId, userId));

            Long customerCount = customerProfileMapper.selectCount(
                    Wrappers.<CustomerProfile>lambdaQuery().eq(CustomerProfile::getInvitedBy, userId));

            Long pendingCommissionCount = commissionMapper.selectCount(
                    Wrappers.<Commission>lambdaQuery()
                            .eq(agent != null, Commission::getAgentId, agent != null ? agent.getId() : null)
                            .eq(Commission::getStatus, "FROZEN"));

            Long settledCommissionCount = commissionMapper.selectCount(
                    Wrappers.<Commission>lambdaQuery()
                            .eq(agent != null, Commission::getAgentId, agent != null ? agent.getId() : null)
                            .eq(Commission::getStatus, "SETTLED"));

            List<Map<String, Object>> commissionDistribution = new ArrayList<>();
            commissionDistribution.add(Map.of("name", "Frozen", "value", pendingCommissionCount));
            commissionDistribution.add(Map.of("name", "Settled", "value", settledCommissionCount));

            data.put("customerCount", customerCount);
            data.put("commissionDistribution", commissionDistribution);
        }

        return ApiResponse.success(data);
    }
}
