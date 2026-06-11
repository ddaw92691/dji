package com.mall.api.modules.order.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("mall_order")
@Schema(description = "订单")
public class MallOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    @Schema(description = "主键ID")
    private Long id;

    @TableField("order_no")
    @Schema(description = "订单号")
    private String orderNo;

    @TableField("user_id")
    @Schema(description = "用户ID")
    private Long userId;

    @TableField("merchant_id")
    @Schema(description = "商家ID")
    private Long merchantId;

    @TableField("total_amount")
    @Schema(description = "商品总金额")
    private BigDecimal totalAmount;

    @TableField("discount_amount")
    @Schema(description = "优惠金额")
    private BigDecimal discountAmount;

    @TableField("shipping_amount")
    @Schema(description = "运费")
    private BigDecimal shippingAmount;

    @TableField("pay_amount")
    @Schema(description = "实付金额")
    private BigDecimal payAmount;

    @Schema(description = "币种")
    private String currency;

    @Schema(description = "订单状态: PENDING_PAYMENT/PAID/SHIPPED/COMPLETED/CANCELLED")
    private String status;

    @TableField("pay_status")
    @Schema(description = "支付状态: UNPAID/PAID/REFUNDED")
    private String payStatus;

    @TableField("address_snapshot")
    @Schema(description = "地址快照(JSON)")
    private String addressSnapshot;

    @Schema(description = "备注")
    private String remark;

    @TableField("logistics_company")
    @Schema(description = "物流公司")
    private String logisticsCompany;

    @TableField("tracking_no")
    @Schema(description = "物流单号")
    private String trackingNo;

    @TableField("paid_at")
    @Schema(description = "支付时间")
    private LocalDateTime paidAt;

    @TableField("shipped_at")
    @Schema(description = "发货时间")
    private LocalDateTime shippedAt;

    @TableField("completed_at")
    @Schema(description = "完成时间")
    private LocalDateTime completedAt;

    @TableField("cancelled_at")
    @Schema(description = "取消时间")
    private LocalDateTime cancelledAt;

    @TableField("receiver_name")
    @Schema(description = "收货人姓名")
    private String receiverName;

    @TableField("receiver_phone")
    @Schema(description = "收货人电话")
    private String receiverPhone;

    @TableField("receiver_address")
    @Schema(description = "收货地址")
    private String receiverAddress;

    @TableField("coupon_id")
    @Schema(description = "优惠券ID")
    private Long couponId;

    @TableField("user_coupon_id")
    @Schema(description = "用户优惠券ID")
    private Long userCouponId;

    @TableField("coupon_amount")
    @Schema(description = "优惠券抵扣金额")
    private BigDecimal couponAmount;

    @TableField("refund_status")
    @Schema(description = "退款状态: NONE/REQUESTED/APPROVED/REJECTED")
    private String refundStatus;

    @TableField("refund_amount")
    @Schema(description = "退款金额")
    private BigDecimal refundAmount;

    @TableField("refund_reason")
    @Schema(description = "退款原因")
    private String refundReason;

    @TableField("refund_reject_reason")
    @Schema(description = "退款拒绝原因")
    private String refundRejectReason;

    @TableField("refunded_at")
    @Schema(description = "退款时间")
    private LocalDateTime refundedAt;

    @TableField("order_source")
    @Schema(description = "订单来源: CUSTOMER/ADMIN_CREATED")
    private String orderSource;

    @TableField("created_by_admin")
    @Schema(description = "创建订单的管理员ID")
    private Long createdByAdmin;

    @TableField("virtual_customer_id")
    @Schema(description = "虚拟客户ID")
    private Long virtualCustomerId;

    // ===== 商家垫付货款 / 结算（双订单模型，仅 order_source != CUSTOMER 的垫付单使用）=====
    @TableField("goods_cost")
    @Schema(description = "货款（商家需垫付的进货成本）")
    private BigDecimal goodsCost;

    @TableField("merchant_profit")
    @Schema(description = "商家利润（结算时连同货款一起返还）")
    private BigDecimal merchantProfit;

    @TableField("merchant_paid_status")
    @Schema(description = "商家货款支付状态: UNPAID/PAID")
    private String merchantPaidStatus;

    @TableField("merchant_paid_at")
    @Schema(description = "商家支付货款时间")
    private LocalDateTime merchantPaidAt;

    @TableField("expected_arrival_at")
    @Schema(description = "预计到货时间")
    private LocalDateTime expectedArrivalAt;

    @TableField("arrival_status")
    @Schema(description = "Arrival status: WAITING/ARRIVED")
    private String arrivalStatus;

    @TableField("arrived_at")
    @Schema(description = "Arrived time")
    private LocalDateTime arrivedAt;

    @TableField("settlement_amount")
    @Schema(description = "Settlement amount")
    private BigDecimal settlementAmount;

    @TableField("settle_status")
    @Schema(description = "货款+利润结算状态: NONE/SETTLED")
    private String settleStatus;

    @TableField("settled_at")
    @Schema(description = "结算时间")
    private LocalDateTime settledAt;

    @TableField("settlement_operator_id")
    @Schema(description = "Settlement operator id")
    private Long settlementOperatorId;

    @TableField("settlement_remark")
    @Schema(description = "Settlement remark")
    private String settlementRemark;

    @Schema(description = "逻辑删除")
    private Boolean deleted;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}
