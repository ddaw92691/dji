package com.mall.api.modules.coupon.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("user_coupon")
@Schema(description = "用户优惠券")
public class UserCoupon implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    @TableField("user_id")
    private Long userId;

    @TableField("coupon_id")
    private Long couponId;

    private String status;

    @TableField("received_at")
    private LocalDateTime receivedAt;

    @TableField("used_at")
    private LocalDateTime usedAt;

    @TableField("order_id")
    private Long orderId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
