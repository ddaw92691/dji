package com.mall.api.modules.payment.entity;

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
@TableName("payment")
@Schema(description = "支付记录")
public class Payment implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    @Schema(description = "主键ID")
    private Long id;

    @TableField("payment_no")
    @Schema(description = "支付单号")
    private String paymentNo;

    @TableField("order_id")
    @Schema(description = "订单ID")
    private Long orderId;

    @TableField("user_id")
    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "支付金额")
    private BigDecimal amount;

    @Schema(description = "币种")
    private String currency;

    @Schema(description = "支付方式")
    private String method;

    @Schema(description = "支付状态: PENDING/SUCCESS/FAILED/REFUNDED")
    private String status;

    @TableField("transaction_no")
    @Schema(description = "交易流水号")
    private String transactionNo;

    @TableField("paid_at")
    @Schema(description = "支付时间")
    private LocalDateTime paidAt;

    @TableField("refunded_amount")
    @Schema(description = "已退款金额")
    private BigDecimal refundedAmount;

    @TableField("refunded_at")
    @Schema(description = "退款时间")
    private LocalDateTime refundedAt;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}
