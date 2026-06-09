package com.mall.api.modules.auth.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.auth.dto.*;
import com.mall.api.modules.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "认证管理")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "用户登录")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ApiResponse.success(response);
    }

    @PostMapping("/register")
    @Operation(summary = "用户注册")
    public ApiResponse<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        LoginResponse response = authService.register(request);
        return ApiResponse.success(response);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "获取当前用户信息")
    public ApiResponse<UserInfo> me() {
        UserInfo userInfo = authService.getCurrentUser();
        return ApiResponse.success(userInfo);
    }

    @GetMapping("/permissions")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "获取用户权限菜单")
    public ApiResponse<PermissionsResponse> permissions() {
        UserInfo userInfo = authService.getCurrentUser();
        String role = userInfo.getRole();
        PermissionsResponse response = authService.getPermissions(role);
        return ApiResponse.success(response);
    }
}
