package com.mall.api.modules.system.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.system.entity.SysRole;
import com.mall.api.modules.system.entity.SysUserRole;
import com.mall.api.modules.system.mapper.SysRoleMapper;
import com.mall.api.modules.system.mapper.SysUserRoleMapper;
import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/admin-users")
@Tag(name = "Admin 管理员管理")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminManagerController {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final SysRoleMapper sysRoleMapper;
    private final SysUserRoleMapper sysUserRoleMapper;

    public AdminManagerController(UserMapper userMapper, PasswordEncoder passwordEncoder,
                                  SysRoleMapper sysRoleMapper, SysUserRoleMapper sysUserRoleMapper) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.sysRoleMapper = sysRoleMapper;
        this.sysUserRoleMapper = sysUserRoleMapper;
    }

    @GetMapping
    @Operation(summary = "管理员列表")
    public ApiResponse<Map<String, Object>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        LambdaQueryWrapper<User> qw = new LambdaQueryWrapper<>();
        qw.eq(User::getDeleted, false)
                .and(w -> w.eq(User::getRole, "ADMIN").or().eq(User::getRole, "SUPER_ADMIN"));
        qw.orderByDesc(User::getCreatedAt);

        Page<User> pg = new Page<>(page, pageSize);
        pg = userMapper.selectPage(pg, qw);
        return ApiResponse.success(Map.of(
                "list", pg.getRecords(), "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }

    @PostMapping
    @Operation(summary = "创建管理员")
    @Transactional
    public ApiResponse<User> create(@RequestBody Map<String, Object> body) {
        String email = (String) body.get("email");
        String password = (String) body.get("password");
        String role = (String) body.getOrDefault("role", "ADMIN");

        if (email == null || email.isEmpty()) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "邮箱不能为空");
        }
        if (password == null || password.isEmpty()) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "密码不能为空");
        }
        if (!"ADMIN".equals(role) && !"SUPER_ADMIN".equals(role)) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "角色无效");
        }

        User exist = userMapper.selectByEmail(email);
        if (exist != null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "邮箱已存在");
        }

        User user = new User();
        user.setUsername(email);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setNickname((String) body.getOrDefault("nickname", email.split("@")[0]));
        user.setRole(role);
        user.setStatus(1);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userMapper.insert(user);

        SysRole sysRole = sysRoleMapper.selectOne(
                new LambdaQueryWrapper<SysRole>().eq(SysRole::getCode, role));
        if (sysRole != null) {
            SysUserRole userRole = new SysUserRole();
            userRole.setUserId(user.getId());
            userRole.setRoleId(sysRole.getId());
            userRole.setCreatedAt(LocalDateTime.now());
            sysUserRoleMapper.insert(userRole);
        }

        return ApiResponse.success(user);
    }

    @PutMapping("/{id}")
    @Operation(summary = "编辑管理员")
    public ApiResponse<Void> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        User user = userMapper.selectById(id);
        if (user == null || Boolean.TRUE.equals(user.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "用户不存在");
        }
        if (body.containsKey("email")) user.setEmail((String) body.get("email"));
        if (body.containsKey("phone")) user.setPhone((String) body.get("phone"));
        if (body.containsKey("nickname")) user.setNickname((String) body.get("nickname"));
        if (body.containsKey("role")) user.setRole((String) body.get("role"));
        userMapper.updateById(user);
        return ApiResponse.success();
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "启用/禁用管理员")
    public ApiResponse<Void> updateStatus(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        User user = userMapper.selectById(id);
        if (user == null || Boolean.TRUE.equals(user.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "用户不存在");
        }
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (user.getId().equals(currentUserId)) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "不能禁用自己");
        }
        user.setStatus(body.get("status"));
        userMapper.updateById(user);
        return ApiResponse.success();
    }

    @PutMapping("/{id}/password")
    public ApiResponse<Void> resetPassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userMapper.selectById(id);
        if (user == null || Boolean.TRUE.equals(user.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "User not found");
        }
        String password = body.get("password");
        if (password == null || password.isBlank()) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Password cannot be empty");
        }
        user.setPassword(passwordEncoder.encode(password));
        userMapper.updateById(user);
        return ApiResponse.success();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除管理员")
    @Transactional
    public ApiResponse<Void> delete(@PathVariable Long id) {
        User user = userMapper.selectById(id);
        if (user == null || Boolean.TRUE.equals(user.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "用户不存在");
        }
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (user.getId().equals(currentUserId)) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "不能删除自己");
        }
        if ("SUPER_ADMIN".equals(user.getRole())) {
            long superAdminCount = userMapper.selectCount(
                    new LambdaQueryWrapper<User>()
                            .eq(User::getRole, "SUPER_ADMIN")
                            .eq(User::getDeleted, false));
            if (superAdminCount <= 1) {
                throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "不能删除最后一个超级管理员");
            }
        }
        user.setDeleted(true);
        userMapper.updateById(user);
        return ApiResponse.success();
    }
}
