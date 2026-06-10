package com.mall.api.modules.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "Google 授权登录请求")
public class GoogleLoginRequest {

    @NotBlank(message = "Google credential 不能为空")
    @Schema(description = "Google Identity Services 返回的 ID token")
    private String credential;

    @Schema(description = "国家代码")
    private String countryCode = "JP";

    @Schema(description = "语言代码")
    private String languageCode = "ja";
}
