package com.mall.api.modules.coupon.entity;

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
@TableName("coupon")
@Schema(description = "优惠券")
public class Coupon implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String name;

    private String code;

    private String type;

    private BigDecimal amount;

    @TableField("discount_rate")
    private BigDecimal discountRate;

    @TableField("min_spend")
    private BigDecimal minSpend;

    @TableField("total_quantity")
    private Integer totalQuantity;

    @TableField("received_quantity")
    private Integer receivedQuantity;

    @TableField("used_quantity")
    private Integer usedQuantity;

    @TableField("per_user_limit")
    private Integer perUserLimit;

    @TableField("start_at")
    private LocalDateTime startAt;

    @TableField("end_at")
    private LocalDateTime endAt;

    private String status;

    private Boolean deleted;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
