package com.mall.api.modules.user.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.mall.api.common.entity.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_user")
@Schema(description = "系统用户")
public class User extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @Schema(description = "用户名")
    private String username;

    @Schema(description = "密码")
    private String password;

    @Schema(description = "邮箱")
    private String email;

    @Schema(description = "手机号")
    private String phone;

    @Schema(description = "昵称")
    private String nickname;

    @Schema(description = "头像")
    private String avatar;

    @Schema(description = "角色")
    private String role;

    @Schema(description = "状态: 1-启用, 0-禁用")
    private Integer status;

    @Schema(description = "最后登录时间")
    private LocalDateTime lastLoginAt;

    @Schema(description = "最后登录IP")
    private String lastLoginIp;

    @Schema(description = "逻辑删除")
    private Boolean deleted;

    @Schema(description = "国家代码")
    private String countryCode;

    @Schema(description = "语言代码")
    private String languageCode;

    @Schema(description = "邀请码")
    private String inviteCode;

    @Schema(description = "邀请人ID")
    private Long invitedBy;

    @TableField("is_virtual")
    @Schema(description = "是否虚拟用户")
    private Boolean isVirtual;

    @TableField("virtual_remark")
    @Schema(description = "虚拟用户备注")
    private String virtualRemark;

    @TableField("created_by_admin")
    @Schema(description = "创建该用户的管理员ID")
    private Long createdByAdmin;
}
