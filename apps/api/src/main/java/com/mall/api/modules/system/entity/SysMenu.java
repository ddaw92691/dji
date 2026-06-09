package com.mall.api.modules.system.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.mall.api.common.entity.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_menu")
@Schema(description = "系统菜单")
public class SysMenu extends BaseEntity {

    private static final long serialVersionUID = 1L;

    @TableField("parent_id")
    @Schema(description = "父菜单ID")
    private Long parentId;

    @TableField("app_type")
    @Schema(description = "应用类型: ADMIN-管理端, MERCHANT-商家端")
    private String appType;

    @Schema(description = "菜单类型: DIRECTORY-目录, MENU-菜单, BUTTON-按钮")
    private String type;

    @Schema(description = "路由路径")
    private String path;

    @Schema(description = "组件路径")
    private String component;

    @Schema(description = "菜单标题")
    private String title;

    @Schema(description = "图标")
    private String icon;

    @Schema(description = "权限标识")
    private String permission;

    @Schema(description = "排序")
    private Integer sort;

    @Schema(description = "状态: ENABLE-启用, DISABLE-禁用")
    private String status;

    @Schema(description = "是否可见")
    private Boolean visible;

    @Schema(description = "是否删除")
    private Boolean deleted;
}
