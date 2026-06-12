package com.mall.api.modules.dashboard.controller;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.agent.entity.Agent;
import com.mall.api.modules.agent.mapper.AgentMapper;
import com.mall.api.modules.commission.entity.Commission;
import com.mall.api.modules.commission.mapper.CommissionMapper;
import com.mall.api.modules.country.entity.Country;
import com.mall.api.modules.country.mapper.CountryMapper;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.order.entity.MallOrder;
import com.mall.api.modules.order.mapper.MallOrderMapper;
import com.mall.api.modules.payment.entity.Payment;
import com.mall.api.modules.payment.mapper.PaymentMapper;
import com.mall.api.modules.product.entity.Product;
import com.mall.api.modules.product.mapper.ProductMapper;
import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import com.mall.api.modules.withdrawal.entity.Withdrawal;
import com.mall.api.modules.withdrawal.mapper.WithdrawalMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@Tag(name = "管理员仪表盘")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class DashboardController {

    private static final BigDecimal ZERO = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

    private final UserMapper userMapper;
    private final MerchantMapper merchantMapper;
    private final AgentMapper agentMapper;
    private final ProductMapper productMapper;
    private final MallOrderMapper orderMapper;
    private final PaymentMapper paymentMapper;
    private final WithdrawalMapper withdrawalMapper;
    private final CommissionMapper commissionMapper;
    private final CountryMapper countryMapper;

    public DashboardController(UserMapper userMapper, MerchantMapper merchantMapper,
                               AgentMapper agentMapper, ProductMapper productMapper,
                               MallOrderMapper orderMapper, PaymentMapper paymentMapper,
                               WithdrawalMapper withdrawalMapper, CommissionMapper commissionMapper,
                               CountryMapper countryMapper) {
        this.userMapper = userMapper;
        this.merchantMapper = merchantMapper;
        this.agentMapper = agentMapper;
        this.productMapper = productMapper;
        this.orderMapper = orderMapper;
        this.paymentMapper = paymentMapper;
        this.withdrawalMapper = withdrawalMapper;
        this.commissionMapper = commissionMapper;
        this.countryMapper = countryMapper;
    }

    @GetMapping
    @Operation(summary = "管理员仪表盘概览")
    @PreAuthorize("@perm.has('admin:dashboard:view')")
    public ApiResponse<Map<String, Object>> overview() {
        Map<String, Object> data = new HashMap<>();

        Long totalUsers = userMapper.selectCount(
                Wrappers.<User>lambdaQuery().eq(User::getDeleted, false));
        Long totalCustomers = userMapper.selectCount(
                Wrappers.<User>lambdaQuery().eq(User::getRole, "CUSTOMER").eq(User::getDeleted, false));
        Long totalMerchants = merchantMapper.selectCount(
                Wrappers.<Merchant>lambdaQuery().eq(Merchant::getStatus, "ENABLE").eq(Merchant::getDeleted, false));
        Long totalAgents = agentMapper.selectCount(
                Wrappers.<Agent>lambdaQuery().eq(Agent::getStatus, "ENABLE").eq(Agent::getDeleted, false));
        Long totalProducts = productMapper.selectCount(
                Wrappers.<Product>lambdaQuery().eq(Product::getDeleted, false));
        Long pendingProducts = productMapper.selectCount(
                Wrappers.<Product>lambdaQuery()
                        .eq(Product::getDeleted, false)
                        .eq(Product::getAuditStatus, "PENDING"));
        Long totalOrders = orderMapper.selectCount(
                Wrappers.<MallOrder>lambdaQuery().eq(MallOrder::getDeleted, false));
        Long paidOrders = orderMapper.selectCount(
                Wrappers.<MallOrder>lambdaQuery()
                        .eq(MallOrder::getDeleted, false)
                        .eq(MallOrder::getPayStatus, "PAID"));
        Long completedOrders = orderMapper.selectCount(
                Wrappers.<MallOrder>lambdaQuery()
                        .eq(MallOrder::getDeleted, false)
                        .eq(MallOrder::getStatus, "COMPLETED"));

        Map<String, BigDecimal> exchangeRateCache = new HashMap<>();
        BigDecimal totalSales = sumPaymentsAsUsd(
                paymentMapper.selectList(Wrappers.<Payment>lambdaQuery().eq(Payment::getStatus, "SUCCESS")),
                exchangeRateCache
        );

        LocalDate today = LocalDate.now();
        Long todayOrders = orderMapper.selectCount(
                Wrappers.<MallOrder>lambdaQuery()
                        .eq(MallOrder::getDeleted, false)
                        .ge(MallOrder::getCreatedAt, today.atStartOfDay())
                        .le(MallOrder::getCreatedAt, today.atTime(23, 59, 59)));

        BigDecimal todaySales = sumPaymentsAsUsd(
                paymentMapper.selectList(
                        Wrappers.<Payment>lambdaQuery()
                                .eq(Payment::getStatus, "SUCCESS")
                                .ge(Payment::getPaidAt, today.atStartOfDay())
                                .le(Payment::getPaidAt, today.atTime(23, 59, 59))),
                exchangeRateCache
        );

        BigDecimal totalCommission = sumCommissions(
                commissionMapper.selectList(Wrappers.<Commission>lambdaQuery())
        );

        Long pendingWithdrawals = withdrawalMapper.selectCount(
                Wrappers.<Withdrawal>lambdaQuery().eq(Withdrawal::getStatus, "PENDING"));

        Long refundRequests = orderMapper.selectCount(
                Wrappers.<MallOrder>lambdaQuery()
                        .eq(MallOrder::getDeleted, false)
                        .eq(MallOrder::getRefundStatus, "REQUESTED"));

        data.put("baseCurrency", "USD");
        data.put("totalUsers", totalUsers);
        data.put("totalCustomers", totalCustomers);
        data.put("totalMerchants", totalMerchants);
        data.put("totalAgents", totalAgents);
        data.put("totalProducts", totalProducts);
        data.put("pendingProducts", pendingProducts);
        data.put("totalOrders", totalOrders);
        data.put("paidOrders", paidOrders);
        data.put("completedOrders", completedOrders);
        data.put("refundRequests", refundRequests);
        data.put("pendingRefunds", refundRequests);
        data.put("totalSales", totalSales);
        data.put("todayOrders", todayOrders);
        data.put("todaySales", todaySales);
        data.put("totalCommission", totalCommission);
        data.put("pendingWithdrawals", pendingWithdrawals);
        data.put("recentOrders", recentOrders());
        data.put("recentRefunds", recentRefunds());

        return ApiResponse.success(data);
    }

    @GetMapping("/charts")
    @Operation(summary = "管理员图表数据")
    @PreAuthorize("@perm.has('admin:dashboard:view')")
    public ApiResponse<Map<String, Object>> charts() {
        Map<String, Object> data = new HashMap<>();

        LocalDate today = LocalDate.now();
        List<Map<String, Object>> salesTrend = new ArrayList<>();
        List<Map<String, Object>> orderTrend = new ArrayList<>();
        Map<String, BigDecimal> exchangeRateCache = new HashMap<>();

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String dateStr = date.toString();

            BigDecimal daySales = sumPaymentsAsUsd(
                    paymentMapper.selectList(
                            Wrappers.<Payment>lambdaQuery()
                                    .eq(Payment::getStatus, "SUCCESS")
                                    .ge(Payment::getPaidAt, date.atStartOfDay())
                                    .le(Payment::getPaidAt, date.atTime(23, 59, 59))),
                    exchangeRateCache
            );
            Map<String, Object> sp = new HashMap<>();
            sp.put("date", dateStr);
            sp.put("amount", daySales);
            salesTrend.add(sp);

            Long dayOrders = orderMapper.selectCount(
                    Wrappers.<MallOrder>lambdaQuery()
                            .eq(MallOrder::getDeleted, false)
                            .ge(MallOrder::getCreatedAt, date.atStartOfDay())
                            .le(MallOrder::getCreatedAt, date.atTime(23, 59, 59)));
            Map<String, Object> op = new HashMap<>();
            op.put("date", dateStr);
            op.put("count", dayOrders);
            orderTrend.add(op);
        }

        Long pendingPayment = orderMapper.selectCount(
                Wrappers.<MallOrder>lambdaQuery().eq(MallOrder::getDeleted, false).eq(MallOrder::getStatus, "PENDING_PAYMENT"));
        Long paid = orderMapper.selectCount(
                Wrappers.<MallOrder>lambdaQuery().eq(MallOrder::getDeleted, false).eq(MallOrder::getStatus, "PAID"));
        Long shipped = orderMapper.selectCount(
                Wrappers.<MallOrder>lambdaQuery().eq(MallOrder::getDeleted, false).eq(MallOrder::getStatus, "SHIPPED"));
        Long completed = orderMapper.selectCount(
                Wrappers.<MallOrder>lambdaQuery().eq(MallOrder::getDeleted, false).eq(MallOrder::getStatus, "COMPLETED"));
        Long cancelled = orderMapper.selectCount(
                Wrappers.<MallOrder>lambdaQuery().eq(MallOrder::getDeleted, false).eq(MallOrder::getStatus, "CANCELLED"));

        List<Map<String, Object>> orderStatusDistribution = new ArrayList<>();
        orderStatusDistribution.add(Map.of("name", "Pending Payment", "value", pendingPayment));
        orderStatusDistribution.add(Map.of("name", "Paid", "value", paid));
        orderStatusDistribution.add(Map.of("name", "Shipped", "value", shipped));
        orderStatusDistribution.add(Map.of("name", "Completed", "value", completed));
        orderStatusDistribution.add(Map.of("name", "Cancelled", "value", cancelled));

        Long superAdminCount = userMapper.selectCount(
                Wrappers.<User>lambdaQuery().eq(User::getRole, "SUPER_ADMIN").eq(User::getDeleted, false));
        Long adminCount = userMapper.selectCount(
                Wrappers.<User>lambdaQuery().eq(User::getRole, "ADMIN").eq(User::getDeleted, false));
        Long merchantCount = userMapper.selectCount(
                Wrappers.<User>lambdaQuery().eq(User::getRole, "MERCHANT").eq(User::getDeleted, false));
        Long agentCount = userMapper.selectCount(
                Wrappers.<User>lambdaQuery().eq(User::getRole, "AGENT").eq(User::getDeleted, false));
        Long customerCount = userMapper.selectCount(
                Wrappers.<User>lambdaQuery().eq(User::getRole, "CUSTOMER").eq(User::getDeleted, false));

        List<Map<String, Object>> userRoleDistribution = new ArrayList<>();
        userRoleDistribution.add(Map.of("name", "Customer", "value", customerCount));
        userRoleDistribution.add(Map.of("name", "Merchant", "value", merchantCount));
        userRoleDistribution.add(Map.of("name", "Agent", "value", agentCount));
        userRoleDistribution.add(Map.of("name", "Admin", "value", adminCount + superAdminCount));

        data.put("baseCurrency", "USD");
        data.put("salesTrend", salesTrend);
        data.put("orderTrend", orderTrend);
        data.put("orderStatusDistribution", orderStatusDistribution);
        data.put("userRoleDistribution", userRoleDistribution);

        return ApiResponse.success(data);
    }

    private BigDecimal sumPaymentsAsUsd(List<Payment> payments, Map<String, BigDecimal> exchangeRateCache) {
        BigDecimal total = BigDecimal.ZERO;
        for (Payment payment : payments) {
            if (payment.getAmount() == null) {
                continue;
            }
            total = total.add(convertToUsd(payment.getAmount(), payment.getCurrency(), exchangeRateCache));
        }
        return money(total);
    }

    private BigDecimal sumCommissions(List<Commission> commissions) {
        BigDecimal total = BigDecimal.ZERO;
        for (Commission commission : commissions) {
            if (commission.getAmount() != null) {
                total = total.add(commission.getAmount());
            }
        }
        return money(total);
    }

    private BigDecimal convertToUsd(BigDecimal amount, String currencyCode, Map<String, BigDecimal> exchangeRateCache) {
        if (amount == null) {
            return ZERO;
        }
        if (currencyCode == null || currencyCode.isBlank() || "USD".equalsIgnoreCase(currencyCode)) {
            return money(amount);
        }
        String normalizedCurrency = currencyCode.trim().toUpperCase(Locale.ROOT);
        BigDecimal exchangeRate = exchangeRateCache.computeIfAbsent(normalizedCurrency, this::loadExchangeRateByCurrency);
        if (exchangeRate == null || exchangeRate.compareTo(BigDecimal.ZERO) <= 0) {
            return money(amount);
        }
        return money(amount.divide(exchangeRate, 2, RoundingMode.HALF_UP));
    }

    private BigDecimal loadExchangeRateByCurrency(String currencyCode) {
        Country country = countryMapper.selectOne(
                Wrappers.<Country>lambdaQuery()
                        .eq(Country::getCurrencyCode, currencyCode)
                        .eq(Country::getStatus, "ENABLE")
                        .eq(Country::getDeleted, false)
                        .last("LIMIT 1")
        );
        if (country == null || country.getExchangeRate() == null) {
            return BigDecimal.ONE;
        }
        return country.getExchangeRate();
    }

    private List<Map<String, Object>> recentOrders() {
        List<MallOrder> orders = orderMapper.selectList(
                Wrappers.<MallOrder>lambdaQuery()
                        .eq(MallOrder::getDeleted, false)
                        .orderByDesc(MallOrder::getCreatedAt)
                        .last("LIMIT 8")
        );
        List<Map<String, Object>> rows = new ArrayList<>();
        for (MallOrder order : orders) {
            rows.add(orderRow(order, false));
        }
        return rows;
    }

    private List<Map<String, Object>> recentRefunds() {
        List<MallOrder> orders = orderMapper.selectList(
                Wrappers.<MallOrder>lambdaQuery()
                        .eq(MallOrder::getDeleted, false)
                        .isNotNull(MallOrder::getRefundStatus)
                        .ne(MallOrder::getRefundStatus, "NONE")
                        .orderByDesc(MallOrder::getCreatedAt)
                        .last("LIMIT 8")
        );
        List<Map<String, Object>> rows = new ArrayList<>();
        for (MallOrder order : orders) {
            rows.add(orderRow(order, true));
        }
        return rows;
    }

    private Map<String, Object> orderRow(MallOrder order, boolean refundRow) {
        Map<String, Object> row = new HashMap<>();
        row.put("id", order.getId());
        row.put("orderNo", order.getOrderNo());
        row.put("userName", resolveUserDisplayName(order.getUserId()));
        row.put("payAmount", money(order.getPayAmount()));
        row.put("currency", order.getCurrency() == null ? "USD" : order.getCurrency());
        row.put("status", order.getStatus());
        row.put("payStatus", order.getPayStatus());
        row.put("createdAt", order.getCreatedAt());
        if (refundRow) {
            row.put("refundAmount", money(order.getRefundAmount() != null ? order.getRefundAmount() : order.getPayAmount()));
            row.put("refundStatus", order.getRefundStatus());
        }
        return row;
    }

    private String resolveUserDisplayName(Long userId) {
        if (userId == null) {
            return "-";
        }
        User user = userMapper.selectById(userId);
        if (user == null) {
            return "-";
        }
        if (user.getNickname() != null && !user.getNickname().isBlank()) {
            return user.getNickname();
        }
        if (user.getUsername() != null && !user.getUsername().isBlank()) {
            return user.getUsername();
        }
        if (user.getEmail() != null && !user.getEmail().isBlank()) {
            return user.getEmail();
        }
        return String.valueOf(user.getId());
    }

    private BigDecimal money(BigDecimal amount) {
        if (amount == null) {
            return ZERO;
        }
        return amount.setScale(2, RoundingMode.HALF_UP);
    }
}
