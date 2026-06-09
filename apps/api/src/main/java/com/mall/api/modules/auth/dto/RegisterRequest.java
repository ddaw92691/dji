package com.mall.api.modules.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "注册请求")
public class RegisterRequest {

    @Email(message = "邮箱格式不正确")
    @Schema(description = "邮箱")
    private String email;

    @Schema(description = "手机号")
    private String phone;

    @NotBlank(message = "密码不能为空")
    @Schema(description = "密码")
    private String password;

    @NotBlank(message = "国家代码不能为空")
    @Schema(description = "国家代码", example = "CN")
    private String countryCode;

    @Schema(description = "语言代码", example = "zh_CN")
    private String languageCode;

    @Schema(description = "邀请码")
    private String inviteCode;
}
