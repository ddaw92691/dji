package com.mall.api.modules.system.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@Tag(name = "Admin 用户管理")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminUserController {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public AdminUserController(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    @Operation(summary = "用户列表")
    public ApiResponse<Map<String, Object>> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        LambdaQueryWrapper<User> qw = new LambdaQueryWrapper<>();
        qw.eq(User::getDeleted, false);
        if (keyword != null && !keyword.isEmpty()) {
            qw.and(w -> w.like(User::getUsername, keyword)
                    .or().like(User::getEmail, keyword)
                    .or().like(User::getPhone, keyword)
                    .or().like(User::getNickname, keyword));
        }
        if (role != null && !role.isEmpty()) {
            qw.eq(User::getRole, role);
        }
        if (status != null) {
            qw.eq(User::getStatus, status);
        }
        qw.orderByDesc(User::getCreatedAt);

        Page<User> pg = new Page<>(page, pageSize);
        pg = userMapper.selectPage(pg, qw);
        return ApiResponse.success(Map.of(
                "list", pg.getRecords(), "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }

    @GetMapping("/{id}")
    @Operation(summary = "用户详情")
    public ApiResponse<User> detail(@PathVariable Long id) {
        User user = userMapper.selectById(id);
        if (user == null || Boolean.TRUE.equals(user.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "用户不存在");
        }
        return ApiResponse.success(user);
    }

    @PutMapping("/{id}")
    @Operation(summary = "编辑用户")
    public ApiResponse<Void> update(@PathVariable Long id, @RequestBody User body) {
        User user = userMapper.selectById(id);
        if (user == null || Boolean.TRUE.equals(user.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "用户不存在");
        }
        if ("SUPER_ADMIN".equals(user.getRole()) && !SecurityUtils.hasRole("SUPER_ADMIN")) {
            throw new BusinessException(ResultCode.FORBIDDEN.getCode(), "无权修改超级管理员");
        }
        if (body.getEmail() != null) user.setEmail(body.getEmail());
        if (body.getPhone() != null) user.setPhone(body.getPhone());
        if (body.getNickname() != null) user.setNickname(body.getNickname());
        if (body.getAvatar() != null) user.setAvatar(body.getAvatar());
        if (body.getCountryCode() != null) user.setCountryCode(body.getCountryCode());
        if (body.getLanguageCode() != null) user.setLanguageCode(body.getLanguageCode());
        if (body.getStatus() != null) user.setStatus(body.getStatus());
        userMapper.updateById(user);
        return ApiResponse.success();
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "启用/禁用用户")
    public ApiResponse<Void> updateStatus(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        User user = userMapper.selectById(id);
        if (user == null || Boolean.TRUE.equals(user.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "用户不存在");
        }
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (user.getId().equals(currentUserId)) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "不能禁用自己");
        }
        if ("SUPER_ADMIN".equals(user.getRole()) && !SecurityUtils.hasRole("SUPER_ADMIN")) {
            throw new BusinessException(ResultCode.FORBIDDEN.getCode(), "无权操作超级管理员");
        }
        user.setStatus(body.get("status"));
        userMapper.updateById(user);
        return ApiResponse.success();
    }

    @PutMapping("/{id}/password")
    @Operation(summary = "重置密码")
    public ApiResponse<Void> resetPassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userMapper.selectById(id);
        if (user == null || Boolean.TRUE.equals(user.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "用户不存在");
        }
        if ("SUPER_ADMIN".equals(user.getRole()) && !SecurityUtils.hasRole("SUPER_ADMIN")) {
            throw new BusinessException(ResultCode.FORBIDDEN.getCode(), "无权操作超级管理员");
        }
        user.setPassword(passwordEncoder.encode(body.get("password")));
        userMapper.updateById(user);
        return ApiResponse.success();
    }
}
