package com.mall.api.modules.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "登录请求")
public class LoginRequest {

    @NotBlank(message = "账号不能为空")
    @Schema(description = "账号（邮箱/手机号/用户名）", example = "admin@example.com")
    private String account;

    @NotBlank(message = "密码不能为空")
    @Schema(description = "密码", example = "admin123456")
    private String password;

    @Schema(description = "登录方式", example = "password")
    private String loginType = "password";
}
