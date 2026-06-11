package com.mall.api.modules.merchant.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("merchant_fund_log")
public class MerchantFundLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    @TableField("merchant_id")
    private Long merchantId;

    /** ADJUST_INCREASE / ADJUST_DECREASE / RECHARGE / ORDER_PAY / SETTLE / WITHDRAW ... */
    private String type;

    private BigDecimal amount;

    @TableField("balance_before")
    private BigDecimal balanceBefore;

    @TableField("balance_after")
    private BigDecimal balanceAfter;

    @TableField("frozen_balance_before")
    private BigDecimal frozenBalanceBefore;

    @TableField("frozen_balance_after")
    private BigDecimal frozenBalanceAfter;

    @TableField("operator_type")
    private String operatorType;

    private String reason;

    @TableField("related_order_id")
    private Long relatedOrderId;

    @TableField("related_recharge_id")
    private Long relatedRechargeId;

    @TableField("ref_type")
    private String refType;

    @TableField("ref_id")
    private Long refId;

    private String remark;

    @TableField("operator_id")
    private Long operatorId;

    @TableField("created_at")
    private LocalDateTime createdAt;
}
