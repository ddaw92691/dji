package com.mall.api.modules.order.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "创建订单请求")
public class CreateOrderRequest {

    @Schema(description = "订单来源: CART/BUY_NOW")
    private String source;

    @Schema(description = "购物车项ID列表(source=CART时使用)")
    private List<Long> cartItemIds;

    @Schema(description = "商品ID(source=BUY_NOW时使用)")
    private Long productId;

    @Schema(description = "购买数量(source=BUY_NOW时使用)")
    private Integer quantity;

    @Schema(description = "收货地址ID")
    private Long addressId;

    @Schema(description = "备注")
    private String remark;

    @Schema(description = "用户优惠券ID")
    private Long userCouponId;
}
