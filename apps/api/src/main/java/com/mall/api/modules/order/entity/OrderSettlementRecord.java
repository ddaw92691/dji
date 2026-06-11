package com.mall.api.modules.order.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("order_settlement_record")
public class OrderSettlementRecord implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    @TableField("order_id")
    private Long orderId;

    @TableField("merchant_id")
    private Long merchantId;

    @TableField("goods_cost")
    private BigDecimal goodsCost;

    @TableField("merchant_profit")
    private BigDecimal merchantProfit;

    @TableField("settlement_amount")
    private BigDecimal settlementAmount;

    private String status;

    @TableField("operator_id")
    private Long operatorId;

    private String remark;

    @TableField("settled_at")
    private LocalDateTime settledAt;

    @TableField("created_at")
    private LocalDateTime createdAt;

    @TableField("updated_at")
    private LocalDateTime updatedAt;
}
