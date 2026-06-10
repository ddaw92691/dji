package com.mall.api.modules.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(description = "经销商申请响应")
public class MerchantApplicationResponse {
    private Long id;
    private String status;
}
