package com.mall.api.modules.commission.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("commission")
public class Commission implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    @TableField("agent_id")
    private Long agentId;

    @TableField("order_id")
    private Long orderId;

    @TableField("order_no")
    private String orderNo;

    @TableField("user_id")
    private Long userId;

    @TableField("buyer_user_id")
    private Long buyerUserId;

    @TableField("order_item_id")
    private Long orderItemId;

    private BigDecimal amount;

    private BigDecimal rate;

    private String status;

    @TableField("settled_at")
    private LocalDateTime settledAt;

    @TableField("cancelled_at")
    private LocalDateTime cancelledAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
