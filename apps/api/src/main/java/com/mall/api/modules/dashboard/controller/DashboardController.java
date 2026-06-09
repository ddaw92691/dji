package com.mall.api.modules.dashboard.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.agent.entity.Agent;
import com.mall.api.modules.agent.mapper.AgentMapper;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@Tag(name = "管理员仪表盘")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class DashboardController {

    private final UserMapper userMapper;
    private final MerchantMapper merchantMapper;
    private final AgentMapper agentMapper;
    private final ProductMapper productMapper;
    private final MallOrderMapper orderMapper;
    private final PaymentMapper paymentMapper;
    private final WithdrawalMapper withdrawalMapper;

    public DashboardController(UserMapper userMapper, MerchantMapper merchantMapper,
                               AgentMapper agentMapper, ProductMapper productMapper,
                               MallOrderMapper orderMapper, PaymentMapper paymentMapper,
                               WithdrawalMapper withdrawalMapper) {
        this.userMapper = userMapper;
        this.merchantMapper = merchantMapper;
        this.agentMapper = agentMapper;
        this.productMapper = productMapper;
        this.orderMapper = orderMapper;
        this.paymentMapper = paymentMapper;
        this.withdrawalMapper = withdrawalMapper;
    }

    @GetMapping
    @Operation(summary = "管理员仪表盘概览")
    public ApiResponse<Map<String, Object>> overview() {
        Map<String, Object> data = new HashMap<>();

        Long totalUsers = userMapper.selectCount(null);
        Long totalMerchants = merchantMapper.selectCount(
                Wrappers.<Merchant>lambdaQuery().eq(Merchant::getStatus, "ENABLE"));
        Long totalAgents = agentMapper.selectCount(
                Wrappers.<Agent>lambdaQuery().eq(Agent::getStatus, "ENABLE"));
        Long totalProducts = productMapper.selectCount(
                Wrappers.<Product>lambdaQuery().eq(Product::getDeleted, false));
        Long totalOrders = orderMapper.selectCount(
                Wrappers.<MallOrder>lambdaQuery().eq(MallOrder::getDeleted, false));

        BigDecimal totalSales = BigDecimal.ZERO;
        for (Payment p : paymentMapper.selectList(
                Wrappers.<Payment>lambdaQuery().eq(Payment::getStatus, "SUCCESS"))) {
            if (p.getAmount() != null) {
                totalSales = totalSales.add(p.getAmount());
            }
        }

        LocalDate today = LocalDate.now();
        Long todayOrders = orderMapper.selectCount(
                Wrappers.<MallOrder>lambdaQuery()
                        .eq(MallOrder::getDeleted, false)
                        .ge(MallOrder::getCreatedAt, today.atStartOfDay())
                        .le(MallOrder::getCreatedAt, today.atTime(23, 59, 59)));

        BigDecimal todaySales = BigDecimal.ZERO;
        for (Payment p : paymentMapper.selectList(
                Wrappers.<Payment>lambdaQuery()
                        .eq(Payment::getStatus, "SUCCESS")
                        .ge(Payment::getPaidAt, today.atStartOfDay())
                        .le(Payment::getPaidAt, today.atTime(23, 59, 59)))) {
            if (p.getAmount() != null) {
                todaySales = todaySales.add(p.getAmount());
            }
        }

        Long pendingWithdrawals = withdrawalMapper.selectCount(
                Wrappers.<Withdrawal>lambdaQuery().eq(Withdrawal::getStatus, "PENDING"));

        Long pendingRefunds = orderMapper.selectCount(
                Wrappers.<MallOrder>lambdaQuery()
                        .eq(MallOrder::getDeleted, false)
                        .eq(MallOrder::getRefundStatus, "REQUESTED"));

        data.put("totalUsers", totalUsers);
        data.put("totalMerchants", totalMerchants);
        data.put("totalAgents", totalAgents);
        data.put("totalProducts", totalProducts);
        data.put("totalOrders", totalOrders);
        data.put("totalSales", totalSales);
        data.put("todayOrders", todayOrders);
        data.put("todaySales", todaySales);
        data.put("pendingWithdrawals", pendingWithdrawals);
        data.put("pendingRefunds", pendingRefunds);

        return ApiResponse.success(data);
    }

    @GetMapping("/charts")
    @Operation(summary = "管理员图表数据")
    public ApiResponse<Map<String, Object>> charts() {
        Map<String, Object> data = new HashMap<>();

        LocalDate today = LocalDate.now();
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

        data.put("salesTrend", salesTrend);
        data.put("orderTrend", orderTrend);
        data.put("orderStatusDistribution", orderStatusDistribution);
        data.put("userRoleDistribution", userRoleDistribution);

        return ApiResponse.success(data);
    }
}
