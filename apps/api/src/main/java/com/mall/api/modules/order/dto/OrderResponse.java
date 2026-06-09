package com.mall.api.modules.order.dto;

import com.mall.api.modules.order.entity.MallOrder;
import com.mall.api.modules.order.entity.OrderItem;
import com.mall.api.modules.payment.entity.Payment;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Schema(description = "订单响应")
public class OrderResponse {

    @Schema(description = "订单信息")
    private MallOrder order;

    @Schema(description = "订单项列表")
    private List<OrderItem> items;

    @Schema(description = "解析后的地址快照")
    private Map<String, Object> addressSnapshot;

    @Schema(description = "支付记录")
    private Payment payment;
}
