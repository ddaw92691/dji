package com.mall.api.modules.export;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mall.api.modules.commission.CommissionService;
import com.mall.api.modules.commission.entity.Commission;
import com.mall.api.modules.commission.mapper.CommissionMapper;
import com.mall.api.modules.order.entity.MallOrder;
import com.mall.api.modules.order.entity.OrderItem;
import com.mall.api.modules.order.mapper.MallOrderMapper;
import com.mall.api.modules.order.mapper.OrderItemMapper;
import com.mall.api.modules.payment.entity.Payment;
import com.mall.api.modules.payment.mapper.PaymentMapper;
import com.mall.api.modules.withdrawal.entity.Withdrawal;
import com.mall.api.modules.withdrawal.mapper.WithdrawalMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class ExportService {

    private final MallOrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final PaymentMapper paymentMapper;
    private final WithdrawalMapper withdrawalMapper;
    private final CommissionService commissionService;
    private final CommissionMapper commissionMapper;

    public ExportService(MallOrderMapper orderMapper, OrderItemMapper orderItemMapper,
                         PaymentMapper paymentMapper, WithdrawalMapper withdrawalMapper,
                         CommissionService commissionService, CommissionMapper commissionMapper) {
        this.orderMapper = orderMapper;
        this.orderItemMapper = orderItemMapper;
        this.paymentMapper = paymentMapper;
        this.withdrawalMapper = withdrawalMapper;
        this.commissionService = commissionService;
        this.commissionMapper = commissionMapper;
    }

    public void exportOrders(String orderNo, Long userId, Long merchantId, String status,
                              HttpServletResponse response) {
        LambdaQueryWrapper<MallOrder> wrapper = Wrappers.<MallOrder>lambdaQuery()
                .eq(MallOrder::getDeleted, false)
                .eq(orderNo != null && !orderNo.isBlank(), MallOrder::getOrderNo, orderNo)
                .eq(userId != null, MallOrder::getUserId, userId)
                .eq(merchantId != null, MallOrder::getMerchantId, merchantId)
                .eq(status != null && !status.isBlank(), MallOrder::getStatus, status)
                .orderByDesc(MallOrder::getCreatedAt);
        List<MallOrder> orders = orderMapper.selectList(wrapper);

        setCsvResponse(response, "orders_" + todayStr() + ".csv");
        try (PrintWriter writer = new PrintWriter(
                new OutputStreamWriter(response.getOutputStream(), StandardCharsets.UTF_8))) {
            writer.println("\uFEFF" + "Order ID,Order No,User ID,Merchant ID,Total Amount,Pay Amount,Status,Pay Status,Receiver Name,Receiver Phone,Receiver Address,Logistics Company,Tracking No,Paid At,Shipped At,Completed At,Created At");
            for (MallOrder o : orders) {
                writer.println(escape(o.getId()) + "," + escape(o.getOrderNo()) + "," + escape(o.getUserId()) + "," +
                        escape(o.getMerchantId()) + "," + escape(o.getTotalAmount()) + "," + escape(o.getPayAmount()) + "," +
                        escape(o.getStatus()) + "," + escape(o.getPayStatus()) + "," + escape(o.getReceiverName()) + "," +
                        escape(o.getReceiverPhone()) + "," + escape(o.getReceiverAddress()) + "," +
                        escape(o.getLogisticsCompany()) + "," + escape(o.getTrackingNo()) + "," +
                        escape(o.getPaidAt()) + "," + escape(o.getShippedAt()) + "," + escape(o.getCompletedAt()) + "," +
                        escape(o.getCreatedAt()));
            }
        } catch (Exception e) {
            throw new RuntimeException("导出失败: " + e.getMessage());
        }
    }

    public void exportMerchantOrders(Long merchantId, String orderNo, String status,
                                      HttpServletResponse response) {
        LambdaQueryWrapper<MallOrder> wrapper = Wrappers.<MallOrder>lambdaQuery()
                .eq(MallOrder::getMerchantId, merchantId)
                .eq(MallOrder::getDeleted, false)
                .eq(orderNo != null && !orderNo.isBlank(), MallOrder::getOrderNo, orderNo)
                .eq(status != null && !status.isBlank(), MallOrder::getStatus, status)
                .orderByDesc(MallOrder::getCreatedAt);
        List<MallOrder> orders = orderMapper.selectList(wrapper);

        setCsvResponse(response, "merchant_orders_" + todayStr() + ".csv");
        try (PrintWriter writer = new PrintWriter(
                new OutputStreamWriter(response.getOutputStream(), StandardCharsets.UTF_8))) {
            writer.println("\uFEFF" + "Order ID,Order No,User ID,Total Amount,Pay Amount,Status,Pay Status,Receiver Name,Receiver Phone,Receiver Address,Logistics Company,Tracking No,Shipped At,Created At");
            for (MallOrder o : orders) {
                writer.println(escape(o.getId()) + "," + escape(o.getOrderNo()) + "," + escape(o.getUserId()) + "," +
                        escape(o.getTotalAmount()) + "," + escape(o.getPayAmount()) + "," +
                        escape(o.getStatus()) + "," + escape(o.getPayStatus()) + "," +
                        escape(o.getReceiverName()) + "," + escape(o.getReceiverPhone()) + "," +
                        escape(o.getReceiverAddress()) + "," + escape(o.getLogisticsCompany()) + "," +
                        escape(o.getTrackingNo()) + "," + escape(o.getShippedAt()) + "," + escape(o.getCreatedAt()));
            }
        } catch (Exception e) {
            throw new RuntimeException("导出失败: " + e.getMessage());
        }
    }

    public void exportPayments(Long userId, String status, String startDate, String endDate,
                                HttpServletResponse response) {
        LambdaQueryWrapper<Payment> wrapper = Wrappers.<Payment>lambdaQuery()
                .eq(userId != null, Payment::getUserId, userId)
                .eq(status != null && !status.isBlank(), Payment::getStatus, status)
                .ge(startDate != null && !startDate.isBlank(), Payment::getCreatedAt, startDate)
                .le(endDate != null && !endDate.isBlank(), Payment::getCreatedAt, endDate)
                .orderByDesc(Payment::getCreatedAt);
        List<Payment> payments = paymentMapper.selectList(wrapper);

        setCsvResponse(response, "payments_" + todayStr() + ".csv");
        try (PrintWriter writer = new PrintWriter(
                new OutputStreamWriter(response.getOutputStream(), StandardCharsets.UTF_8))) {
            writer.println("\uFEFF" + "Payment ID,Payment No,Order ID,User ID,Amount,Currency,Method,Status,Transaction No,Paid At,Created At");
            for (Payment p : payments) {
                writer.println(escape(p.getId()) + "," + escape(p.getPaymentNo()) + "," + escape(p.getOrderId()) + "," +
                        escape(p.getUserId()) + "," + escape(p.getAmount()) + "," + escape(p.getCurrency()) + "," +
                        escape(p.getMethod()) + "," + escape(p.getStatus()) + "," + escape(p.getTransactionNo()) + "," +
                        escape(p.getPaidAt()) + "," + escape(p.getCreatedAt()));
            }
        } catch (Exception e) {
            throw new RuntimeException("导出失败: " + e.getMessage());
        }
    }

    public void exportWithdrawals(String keyword, String role, String type, String status,
                                   String startDate, String endDate, HttpServletResponse response) {
        LambdaQueryWrapper<Withdrawal> wrapper = Wrappers.<Withdrawal>lambdaQuery()
                .eq(role != null && !role.isBlank(), Withdrawal::getRole, role)
                .eq(type != null && !type.isBlank(), Withdrawal::getType, type)
                .eq(status != null && !status.isBlank(), Withdrawal::getStatus, status)
                .ge(startDate != null && !startDate.isBlank(), Withdrawal::getCreatedAt, startDate)
                .le(endDate != null && !endDate.isBlank(), Withdrawal::getCreatedAt, endDate)
                .orderByDesc(Withdrawal::getCreatedAt);

        if (keyword != null && !keyword.isBlank()) {
            try {
                Long uid = Long.parseLong(keyword);
                wrapper.eq(Withdrawal::getUserId, uid);
            } catch (NumberFormatException e) {
                wrapper.and(w -> w.like(Withdrawal::getBankAccount, keyword)
                        .or().like(Withdrawal::getAccountName, keyword));
            }
        }

        List<Withdrawal> withdrawals = withdrawalMapper.selectList(wrapper);

        setCsvResponse(response, "withdrawals_" + todayStr() + ".csv");
        try (PrintWriter writer = new PrintWriter(
                new OutputStreamWriter(response.getOutputStream(), StandardCharsets.UTF_8))) {
            writer.println("\uFEFF" + "ID,User ID,Role,Type,Amount,Fee,Actual Amount,Currency,Bank Name,Bank Account,Account Name,Status,Remark,Created At");
            for (Withdrawal w : withdrawals) {
                writer.println(escape(w.getId()) + "," + escape(w.getUserId()) + "," + escape(w.getRole()) + "," +
                        escape(w.getType()) + "," + escape(w.getAmount()) + "," + escape(w.getFee()) + "," +
                        escape(w.getActualAmount()) + "," + escape(w.getCurrency()) + "," + escape(w.getBankName()) + "," +
                        escape(w.getBankAccount()) + "," + escape(w.getAccountName()) + "," + escape(w.getStatus()) + "," +
                        escape(w.getRemark()) + "," + escape(w.getCreatedAt()));
            }
        } catch (Exception e) {
            throw new RuntimeException("导出失败: " + e.getMessage());
        }
    }

    public void exportCommissions(String keyword, Long agentId, String status, String startDate,
                                   String endDate, HttpServletResponse response) {
        LambdaQueryWrapper<Commission> wrapper = Wrappers.<Commission>lambdaQuery()
                .eq(agentId != null, Commission::getAgentId, agentId)
                .eq(status != null && !status.isBlank(), Commission::getStatus, status)
                .ge(startDate != null && !startDate.isBlank(), Commission::getCreatedAt, startDate)
                .le(endDate != null && !endDate.isBlank(), Commission::getCreatedAt, endDate)
                .orderByDesc(Commission::getCreatedAt);

        if (keyword != null && !keyword.isBlank()) {
            wrapper.and(w -> w.like(Commission::getOrderNo, keyword));
        }

        List<Commission> commissions = commissionMapper.selectList(wrapper);

        setCsvResponse(response, "commissions_" + todayStr() + ".csv");
        try (PrintWriter writer = new PrintWriter(
                new OutputStreamWriter(response.getOutputStream(), StandardCharsets.UTF_8))) {
            writer.println("\uFEFF" + "ID,Order ID,Order No,Agent ID,User ID,Buyer User ID,Rate,Amount,Status,Created At");
            for (Commission c : commissions) {
                writer.println(escape(c.getId()) + "," + escape(c.getOrderId()) + "," +
                        escape(c.getOrderNo()) + "," + escape(c.getAgentId()) + "," +
                        escape(c.getUserId()) + "," + escape(c.getBuyerUserId()) + "," +
                        escape(c.getRate()) + "," + escape(c.getAmount()) + "," +
                        escape(c.getStatus()) + "," + escape(c.getCreatedAt()));
            }
        } catch (Exception e) {
            throw new RuntimeException("导出失败: " + e.getMessage());
        }
    }

    private void setCsvResponse(HttpServletResponse response, String filename) {
        response.setContentType("text/csv; charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"");
    }

    private String todayStr() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
    }

    private String escape(Object value) {
        if (value == null) return "";
        String s = value.toString();
        if (s.contains(",") || s.contains("\"") || s.contains("\n")) {
            s = s.replace("\"", "\"\"");
            return "\"" + s + "\"";
        }
        return s;
    }
}
