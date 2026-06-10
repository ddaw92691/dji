package com.mall.api.modules.merchant.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("merchant_application")
public class MerchantApplication implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String email;
    private String phone;

    @TableField("password_hash")
    private String passwordHash;

    @TableField("full_name")
    private String fullName;

    private Integer age;

    @TableField("home_address")
    private String homeAddress;

    @TableField("id_card_front_url")
    private String idCardFrontUrl;

    @TableField("id_card_back_url")
    private String idCardBackUrl;

    @TableField("passport_page_url")
    private String passportPageUrl;

    @TableField("driver_license_url")
    private String driverLicenseUrl;

    @TableField("handheld_document_video_url")
    private String handheldDocumentVideoUrl;

    private String status;

    @TableField("review_remark")
    private String reviewRemark;

    @TableField("created_at")
    private LocalDateTime createdAt;

    @TableField("updated_at")
    private LocalDateTime updatedAt;

    private Boolean deleted;
}
