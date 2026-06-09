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
@TableName("order_item")
@Schema(description = "订单项")
public class OrderItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    @Schema(description = "主键ID")
    private Long id;

    @TableField("order_id")
    @Schema(description = "订单ID")
    private Long orderId;

    @TableField("product_id")
    @Schema(description = "商品ID")
    private Long productId;

    @TableField("product_title")
    @Schema(description = "商品标题快照")
    private String productTitle;

    @TableField("product_image")
    @Schema(description = "商品图片快照")
    private String productImage;

    @Schema(description = "单价")
    private BigDecimal price;

    @Schema(description = "数量")
    private Integer quantity;

    @TableField("total_amount")
    @Schema(description = "小计金额")
    private BigDecimal totalAmount;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;
}
