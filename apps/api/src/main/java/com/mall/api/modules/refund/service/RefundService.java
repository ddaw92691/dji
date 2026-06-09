package com.mall.api.modules.refund.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.modules.commission.CommissionService;
import com.mall.api.modules.coupon.CouponService;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.notification.NotificationService;
import com.mall.api.modules.order.entity.MallOrder;
import com.mall.api.modules.order.entity.OrderItem;
import com.mall.api.modules.order.mapper.MallOrderMapper;
import com.mall.api.modules.order.mapper.OrderItemMapper;
import com.mall.api.modules.payment.entity.Payment;
import com.mall.api.modules.payment.mapper.PaymentMapper;
import com.mall.api.modules.product.entity.Product;
import com.mall.api.modules.product.mapper.ProductMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class RefundService {

    private final MallOrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final PaymentMapper paymentMapper;
    private final ProductMapper productMapper;
    private final MerchantMapper merchantMapper;
    private final CommissionService commissionService;
    private final CouponService couponService;
    private final NotificationService notificationService;

    public RefundService(MallOrderMapper orderMapper, OrderItemMapper orderItemMapper,
                         PaymentMapper paymentMapper, ProductMapper productMapper,
                         MerchantMapper merchantMapper, CommissionService commissionService,
                         CouponService couponService, NotificationService notificationService) {
        this.orderMapper = orderMapper;
        this.orderItemMapper = orderItemMapper;
        this.paymentMapper = paymentMapper;
        this.productMapper = productMapper;
        this.merchantMapper = merchantMapper;
        this.commissionService = commissionService;
        this.couponService = couponService;
        this.notificationService = notificationService;
    }

    @Transactional
    public void requestRefund(Long userId, Long orderId, String reason) {
        MallOrder order = orderMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId) || Boolean.TRUE.equals(order.getDeleted())) {
            throw new BusinessException(400, "error.order.notFound");
        }
        List<String> allowedStatuses = List.of("PAID", "SHIPPED", "COMPLETED");
        if (!allowedStatuses.contains(order.getStatus())) {
            throw new BusinessException(400, "当前订单状态不支持退款");
        }
        if (order.getRefundStatus() != null && !"NONE".equals(order.getRefundStatus())) {
            throw new BusinessException(400, "该订单已有退款申请");
        }

        order.setRefundStatus("REQUESTED");
        order.setRefundReason(reason);
        order.setUpdatedAt(LocalDateTime.now());
        order.setStatus("REFUND_REQUESTED");
        orderMapper.updateById(order);
    }

    public Map<String, Object> getRefundsAdmin(String orderNo, Long userId, Long merchantId,
                                                String refundStatus, String startDate, String endDate,
                                                int page, int pageSize) {
        LambdaQueryWrapper<MallOrder> wrapper = Wrappers.<MallOrder>lambdaQuery()
                .eq(MallOrder::getDeleted, false)
                .in(MallOrder::getRefundStatus, "REQUESTED", "APPROVED", "REJECTED")
                .orderByDesc(MallOrder::getUpdatedAt);

        if (orderNo != null && !orderNo.isBlank()) {
            wrapper.like(MallOrder::getOrderNo, orderNo);
        }
        if (userId != null) {
            wrapper.eq(MallOrder::getUserId, userId);
        }
        if (merchantId != null) {
            wrapper.eq(MallOrder::getMerchantId, merchantId);
        }
        if (refundStatus != null && !refundStatus.isBlank()) {
            wrapper.eq(MallOrder::getRefundStatus, refundStatus);
        }
        if (startDate != null && !startDate.isBlank()) {
            wrapper.ge(MallOrder::getUpdatedAt, startDate + " 00:00:00");
        }
        if (endDate != null && !endDate.isBlank()) {
            wrapper.le(MallOrder::getUpdatedAt, endDate + " 23:59:59");
        }

        Page<MallOrder> pg = orderMapper.selectPage(new Page<>(page, pageSize), wrapper);

        List<Map<String, Object>> list = new ArrayList<>();
        for (MallOrder order : pg.getRecords()) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", order.getId());
            item.put("orderNo", order.getOrderNo());
            item.put("userId", order.getUserId());
            item.put("merchantId", order.getMerchantId());
            item.put("payAmount", order.getPayAmount());
            item.put("refundStatus", order.getRefundStatus());
            item.put("refundAmount", order.getRefundAmount());
            item.put("refundReason", order.getRefundReason());
            item.put("refundRejectReason", order.getRefundRejectReason());
            item.put("refundedAt", order.getRefundedAt());
            item.put("status", order.getStatus());
            list.add(item);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    public Map<String, Object> getRefundDetail(Long orderId) {
        MallOrder order = orderMapper.selectById(orderId);
        if (order == null || Boolean.TRUE.equals(order.getDeleted())) {
            throw new BusinessException(400, "error.order.notFound");
        }

        List<OrderItem> items = orderItemMapper.selectList(
                Wrappers.<OrderItem>lambdaQuery().eq(OrderItem::getOrderId, orderId));

        Map<String, Object> detail = new HashMap<>();
        detail.put("order", order);
        detail.put("items", items);
        return detail;
    }

    @Transactional
    public void approveRefund(Long orderId) {
        MallOrder order = orderMapper.selectById(orderId);
        if (order == null || Boolean.TRUE.equals(order.getDeleted())) {
            throw new BusinessException(400, "error.order.notFound");
        }
        if (!"REQUESTED".equals(order.getRefundStatus())) {
            throw new BusinessException(400, "退款状态不正确，无法批准");
        }

        LocalDateTime now = LocalDateTime.now();
        BigDecimal refundAmount = order.getPayAmount();

        order.setRefundStatus("APPROVED");
        order.setRefundAmount(refundAmount);
        order.setRefundedAt(now);
        order.setStatus("REFUNDED");
        order.setPayStatus("REFUNDED");
        order.setUpdatedAt(now);
        orderMapper.updateById(order);

        LambdaQueryWrapper<Payment> payWrapper = Wrappers.<Payment>lambdaQuery()
                .eq(Payment::getOrderId, orderId)
                .eq(Payment::getStatus, "SUCCESS")
                .orderByDesc(Payment::getCreatedAt)
                .last("LIMIT 1");
        Payment payment = paymentMapper.selectOne(payWrapper);
        if (payment != null) {
            payment.setStatus("REFUNDED");
            payment.setRefundedAmount(refundAmount);
            payment.setRefundedAt(now);
            payment.setUpdatedAt(now);
            paymentMapper.updateById(payment);
        }

        List<OrderItem> items = orderItemMapper.selectList(
                Wrappers.<OrderItem>lambdaQuery().eq(OrderItem::getOrderId, orderId));
        for (OrderItem oi : items) {
            Product product = productMapper.selectById(oi.getProductId());
            if (product != null && !Boolean.TRUE.equals(product.getDeleted())) {
                product.setStock(product.getStock() + oi.getQuantity());
                product.setSalesCount(Math.max(0,
                        (product.getSalesCount() != null ? product.getSalesCount() : 0) - oi.getQuantity()));
                productMapper.updateById(product);
            }
        }

        if (order.getMerchantId() != null) {
            Merchant merchant = merchantMapper.selectById(order.getMerchantId());
            if (merchant != null) {
                boolean completed = order.getCompletedAt() != null;
                BigDecimal frozen = merchant.getFrozenBalance() != null ? merchant.getFrozenBalance() : BigDecimal.ZERO;
                BigDecimal balance = merchant.getBalance() != null ? merchant.getBalance() : BigDecimal.ZERO;

                if (!completed) {
                    merchant.setFrozenBalance(frozen.subtract(order.getPayAmount()));
                } else {
                    merchant.setBalance(balance.subtract(order.getPayAmount()));
                }
                merchantMapper.updateById(merchant);
            }
        }

        commissionService.cancelCommission(orderId);

        if (order.getUserId() != null) {
            notificationService.createNotification(order.getUserId(), "CUSTOMER",
                    "Refund approved for Order #" + order.getOrderNo(),
                    "Your refund request for Order #" + order.getOrderNo() + " has been approved.",
                    "REFUND_APPROVED", "order", orderId);
        }
        if (order.getMerchantId() != null) {
            notificationService.createMerchantNotification(order.getMerchantId(),
                    "Refund processed for Order #" + order.getOrderNo(),
                    "Refund of " + refundAmount + " for Order #" + order.getOrderNo() + " has been processed.",
                    "REFUND_APPROVED", "order", orderId);
        }
    }

    @Transactional
    public void rejectRefund(Long orderId, String rejectReason) {
        MallOrder order = orderMapper.selectById(orderId);
        if (order == null || Boolean.TRUE.equals(order.getDeleted())) {
            throw new BusinessException(400, "error.order.notFound");
        }
        if (!"REQUESTED".equals(order.getRefundStatus())) {
            throw new BusinessException(400, "退款状态不正确，无法拒绝");
        }

        order.setRefundStatus("REJECTED");
        order.setRefundRejectReason(rejectReason);
        order.setUpdatedAt(LocalDateTime.now());

        if (order.getCompletedAt() != null) {
            order.setStatus("COMPLETED");
        } else if (order.getShippedAt() != null) {
            order.setStatus("SHIPPED");
        } else if (order.getPaidAt() != null) {
            order.setStatus("PAID");
        }

        orderMapper.updateById(order);

        if (order.getUserId() != null) {
            notificationService.createNotification(order.getUserId(), "CUSTOMER",
                    "Refund rejected for Order #" + order.getOrderNo(),
                    "Your refund request for Order #" + order.getOrderNo() + " has been rejected" +
                            (rejectReason != null ? ": " + rejectReason : ""),
                    "REFUND_REJECTED", "order", orderId);
        }
    }
}
