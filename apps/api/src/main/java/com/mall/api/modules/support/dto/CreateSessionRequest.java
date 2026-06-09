package com.mall.api.modules.support.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;

@Data
@Schema(description = "创建客服会话请求")
public class CreateSessionRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "会话类型: CUSTOMER_TO_MERCHANT/MERCHANT_TO_PLATFORM", requiredMode = Schema.RequiredMode.REQUIRED)
    private String sessionType;

    @Schema(description = "会话标题")
    private String title;

    @Schema(description = "商家ID")
    private Long merchantId;

    @Schema(description = "优先级: LOW/NORMAL/HIGH/URGENT")
    private String priority;

    @Schema(description = "关联商品ID")
    private Long relatedProductId;

    @Schema(description = "关联订单ID")
    private Long relatedOrderId;

    @Schema(description = "首条消息内容")
    private String firstMessage;
}
