package com.mall.api.modules.support.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;

@Data
@Schema(description = "创建巡检会话请求")
public class CreateInspectionRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "商家ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long merchantId;

    @Schema(description = "伪装客户姓名")
    private String fakeCustomerName;

    private String title;

    @Schema(description = "问题内容", requiredMode = Schema.RequiredMode.REQUIRED)
    private String question;

    @Schema(description = "关联商品ID")
    private Long relatedProductId;

    @Schema(description = "关联订单ID")
    private Long relatedOrderId;

    @Schema(description = "巡检客户用户ID")
    private Long inspectionCustomerUserId;
}
