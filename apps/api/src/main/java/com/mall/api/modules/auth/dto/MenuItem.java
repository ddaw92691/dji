package com.mall.api.modules.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "菜单项")
public class MenuItem {

    @Schema(description = "菜单ID")
    private Long id;

    @Schema(description = "菜单类型: directory-目录, menu-菜单")
    private String type;

    @Schema(description = "路由路径")
    private String path;

    @Schema(description = "菜单标题")
    private String title;

    @Schema(description = "图标")
    private String icon;

    @Schema(description = "父菜单ID")
    private Long parentId;

    @Schema(description = "排序")
    private Integer order;

    @Schema(description = "状态")
    private String status;

    @Schema(description = "权限标识")
    private String permission;

    @Schema(description = "子菜单")
    private List<MenuItem> children;
}
