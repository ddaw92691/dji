package com.mall.api.modules.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "经销商申请请求")
public class MerchantApplicationRequest {

    @Email(message = "邮箱格式不正确")
    @NotBlank(message = "邮箱不能为空")
    private String email;

    @NotBlank(message = "手机号不能为空")
    private String phone;

    @NotBlank(message = "登录密码不能为空")
    private String password;

    @NotBlank(message = "姓名不能为空")
    private String fullName;

    @NotNull(message = "年龄不能为空")
    @Min(value = 18, message = "年龄必须大于等于 18")
    private Integer age;

    @NotBlank(message = "家庭地址不能为空")
    private String homeAddress;

    @NotBlank(message = "请选择证件类型")
    private String documentType;

    private String idCardFrontUrl;
    private String idCardBackUrl;
    private String passportPageUrl;
    private String driverLicenseUrl;

    @NotBlank(message = "手持证件视频不能为空")
    private String handheldDocumentVideoUrl;
}
