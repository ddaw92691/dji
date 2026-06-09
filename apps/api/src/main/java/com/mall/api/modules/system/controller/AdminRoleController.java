package com.mall.api.modules.system.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.system.PermissionService;
import com.mall.api.modules.system.entity.SysRole;
import com.mall.api.modules.system.entity.SysRoleMenu;
import com.mall.api.modules.system.entity.SysUserRole;
import com.mall.api.modules.system.mapper.SysRoleMapper;
import com.mall.api.modules.system.mapper.SysRoleMenuMapper;
import com.mall.api.modules.system.mapper.SysUserRoleMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/roles")
@Tag(name = "Admin 角色管理")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminRoleController {

    private final SysRoleMapper sysRoleMapper;
    private final SysRoleMenuMapper sysRoleMenuMapper;
    private final SysUserRoleMapper sysUserRoleMapper;
    private final PermissionService permissionService;

    private static final Set<String> BUILT_IN_ROLES = Set.of("SUPER_ADMIN", "ADMIN", "MERCHANT", "AGENT", "CUSTOMER");

    public AdminRoleController(SysRoleMapper sysRoleMapper, SysRoleMenuMapper sysRoleMenuMapper,
                               SysUserRoleMapper sysUserRoleMapper, PermissionService permissionService) {
        this.sysRoleMapper = sysRoleMapper;
        this.sysRoleMenuMapper = sysRoleMenuMapper;
        this.sysUserRoleMapper = sysUserRoleMapper;
        this.permissionService = permissionService;
    }

    @GetMapping
    @Operation(summary = "角色列表")
    public ApiResponse<List<SysRole>> list() {
        List<SysRole> roles = sysRoleMapper.selectList(
                new LambdaQueryWrapper<SysRole>()
                        .eq(SysRole::getDeleted, false)
                        .orderByAsc(SysRole::getSort));
        return ApiResponse.success(roles);
    }

    @GetMapping("/{id}")
    @Operation(summary = "角色详情")
    public ApiResponse<SysRole> detail(@PathVariable Long id) {
        SysRole role = sysRoleMapper.selectById(id);
        if (role == null || Boolean.TRUE.equals(role.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "角色不存在");
        }
        return ApiResponse.success(role);
    }

    @PostMapping
    @Operation(summary = "创建角色")
    public ApiResponse<SysRole> create(@RequestBody SysRole role) {
        SysRole exist = sysRoleMapper.selectOne(
                new LambdaQueryWrapper<SysRole>().eq(SysRole::getCode, role.getCode()));
        if (exist != null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "角色编码已存在");
        }
        role.setDeleted(false);
        role.setCreatedAt(LocalDateTime.now());
        role.setUpdatedAt(LocalDateTime.now());
        sysRoleMapper.insert(role);
        return ApiResponse.success(role);
    }

    @PutMapping("/{id}")
    @Operation(summary = "编辑角色")
    public ApiResponse<Void> update(@PathVariable Long id, @RequestBody SysRole body) {
        SysRole role = sysRoleMapper.selectById(id);
        if (role == null || Boolean.TRUE.equals(role.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "角色不存在");
        }
        if (body.getName() != null) role.setName(body.getName());
        if (body.getDescription() != null) role.setDescription(body.getDescription());
        if (body.getSort() != null) role.setSort(body.getSort());
        role.setUpdatedAt(LocalDateTime.now());
        sysRoleMapper.updateById(role);
        return ApiResponse.success();
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "启用/禁用角色")
    public ApiResponse<Void> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        SysRole role = sysRoleMapper.selectById(id);
        if (role == null || Boolean.TRUE.equals(role.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "角色不存在");
        }
        if (BUILT_IN_ROLES.contains(role.getCode())) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "不能操作内置角色");
        }
        role.setStatus(body.get("status"));
        sysRoleMapper.updateById(role);
        return ApiResponse.success();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除角色")
    @Transactional
    public ApiResponse<Void> delete(@PathVariable Long id) {
        SysRole role = sysRoleMapper.selectById(id);
        if (role == null || Boolean.TRUE.equals(role.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "角色不存在");
        }
        if (BUILT_IN_ROLES.contains(role.getCode())) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "不能删除内置角色");
        }
        Long userCount = sysUserRoleMapper.selectCount(
                new LambdaQueryWrapper<SysUserRole>().eq(SysUserRole::getRoleId, id));
        if (userCount > 0) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "角色正在使用中，无法删除");
        }
        role.setDeleted(true);
        sysRoleMapper.updateById(role);

        sysRoleMenuMapper.delete(new LambdaQueryWrapper<SysRoleMenu>().eq(SysRoleMenu::getRoleId, id));
        return ApiResponse.success();
    }

    @GetMapping("/{id}/menus")
    @Operation(summary = "获取角色的菜单权限")
    public ApiResponse<List<Long>> getMenus(@PathVariable Long id) {
        SysRole role = sysRoleMapper.selectById(id);
        if (role == null || Boolean.TRUE.equals(role.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "角色不存在");
        }
        return ApiResponse.success(permissionService.getRoleMenus(id));
    }

    @PutMapping("/{id}/menus")
    @Operation(summary = "分配角色菜单")
    @Transactional
    public ApiResponse<Void> assignMenus(@PathVariable Long id, @RequestBody Map<String, List<Long>> body) {
        SysRole role = sysRoleMapper.selectById(id);
        if (role == null || Boolean.TRUE.equals(role.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "角色不存在");
        }
        sysRoleMenuMapper.delete(new LambdaQueryWrapper<SysRoleMenu>().eq(SysRoleMenu::getRoleId, id));

        List<Long> menuIds = body.get("menuIds");
        if (menuIds != null && !menuIds.isEmpty()) {
            for (Long menuId : menuIds) {
                SysRoleMenu rm = new SysRoleMenu();
                rm.setRoleId(id);
                rm.setMenuId(menuId);
                rm.setCreatedAt(LocalDateTime.now());
                sysRoleMenuMapper.insert(rm);
            }
        }
        return ApiResponse.success();
    }
}
