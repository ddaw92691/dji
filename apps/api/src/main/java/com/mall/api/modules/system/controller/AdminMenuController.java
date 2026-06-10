package com.mall.api.modules.system.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.system.PermissionService;
import com.mall.api.modules.system.entity.SysMenu;
import com.mall.api.modules.system.mapper.SysMenuMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/menus")
@Tag(name = "Admin 菜单管理")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminMenuController {

    private final SysMenuMapper sysMenuMapper;
    private final PermissionService permissionService;

    public AdminMenuController(SysMenuMapper sysMenuMapper, PermissionService permissionService) {
        this.sysMenuMapper = sysMenuMapper;
        this.permissionService = permissionService;
    }

    @GetMapping
    @Operation(summary = "菜单树")
    public ApiResponse<List<SysMenu>> tree(@RequestParam(required = false) String appType) {
        return ApiResponse.success(permissionService.getAdminMenuTree(appType));
    }

    @GetMapping("/{id}")
    @Operation(summary = "菜单详情")
    public ApiResponse<SysMenu> detail(@PathVariable Long id) {
        SysMenu menu = sysMenuMapper.selectById(id);
        if (menu == null || Boolean.TRUE.equals(menu.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "菜单不存在");
        }
        return ApiResponse.success(menu);
    }

    @PostMapping
    @Operation(summary = "创建菜单")
    public ApiResponse<SysMenu> create(@RequestBody SysMenu menu) {
        menu.setDeleted(false);
        if (menu.getVisible() == null) menu.setVisible(true);
        if (menu.getStatus() == null) menu.setStatus("ENABLE");
        if (menu.getAppType() == null) menu.setAppType("ADMIN");
        menu.setCreatedAt(LocalDateTime.now());
        menu.setUpdatedAt(LocalDateTime.now());
        sysMenuMapper.insert(menu);
        return ApiResponse.success(menu);
    }

    @PutMapping("/{id}")
    @Operation(summary = "编辑菜单")
    public ApiResponse<Void> update(@PathVariable Long id, @RequestBody SysMenu body) {
        SysMenu menu = sysMenuMapper.selectById(id);
        if (menu == null || Boolean.TRUE.equals(menu.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "菜单不存在");
        }
        if (body.getParentId() != null) menu.setParentId(body.getParentId());
        if (body.getType() != null) menu.setType(body.getType());
        if (body.getPath() != null) menu.setPath(body.getPath());
        if (body.getComponent() != null) menu.setComponent(body.getComponent());
        if (body.getTitle() != null) menu.setTitle(body.getTitle());
        if (body.getIcon() != null) menu.setIcon(body.getIcon());
        if (body.getPermission() != null) menu.setPermission(body.getPermission());
        if (body.getSort() != null) menu.setSort(body.getSort());
        if (body.getVisible() != null) menu.setVisible(body.getVisible());
        if (body.getAppType() != null) menu.setAppType(body.getAppType());
        menu.setUpdatedAt(LocalDateTime.now());
        sysMenuMapper.updateById(menu);
        return ApiResponse.success();
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "启用/禁用菜单")
    public ApiResponse<Void> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        SysMenu menu = sysMenuMapper.selectById(id);
        if (menu == null || Boolean.TRUE.equals(menu.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "菜单不存在");
        }
        menu.setStatus(body.get("status"));
        sysMenuMapper.updateById(menu);
        return ApiResponse.success();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除菜单")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        SysMenu menu = sysMenuMapper.selectById(id);
        if (menu == null || Boolean.TRUE.equals(menu.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "菜单不存在");
        }
        Long childCount = sysMenuMapper.selectCount(
                new LambdaQueryWrapper<SysMenu>()
                        .eq(SysMenu::getParentId, id)
                        .eq(SysMenu::getDeleted, false));
        if (childCount > 0) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "存在子菜单，无法删除");
        }
        menu.setDeleted(true);
        sysMenuMapper.updateById(menu);
        return ApiResponse.success();
    }
}
