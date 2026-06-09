package com.mall.api.modules.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "权限响应")
public class PermissionsResponse {

    @Schema(description = "菜单列表")
    private List<MenuItem> menus;

    @Schema(description = "按钮权限列表")
    private List<String> buttonPermissions;
}
