package com.mall.api.modules.auth.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.auth.dto.*;
import com.mall.api.modules.auth.service.AuthService;
import com.mall.api.security.HumanVerificationService;
import com.mall.api.security.JwtTokenBlacklistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.mall.api.modules.upload.UploadService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "认证管理")
public class AuthController {

    private final AuthService authService;
    private final UploadService uploadService;
    private final HumanVerificationService humanVerificationService;
    private final JwtTokenBlacklistService jwtTokenBlacklistService;

    public AuthController(AuthService authService,
                          UploadService uploadService,
                          HumanVerificationService humanVerificationService,
                          JwtTokenBlacklistService jwtTokenBlacklistService) {
        this.authService = authService;
        this.uploadService = uploadService;
        this.humanVerificationService = humanVerificationService;
        this.jwtTokenBlacklistService = jwtTokenBlacklistService;
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

    @PostMapping("/google")
    @Operation(summary = "Google 授权登录")
    public ApiResponse<LoginResponse> googleLogin(@Valid @RequestBody GoogleLoginRequest request) {
        LoginResponse response = authService.googleLogin(request);
        return ApiResponse.success(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout current JWT")
    public ApiResponse<Void> logout(HttpServletRequest request) {
        jwtTokenBlacklistService.blacklistCurrentToken(request);
        return ApiResponse.success();
    }

    @PostMapping(value = "/merchant-applications/files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "上传经销商申请材料")
    public ApiResponse<Map<String, Object>> uploadMerchantApplicationFile(@RequestParam("file") MultipartFile file,
                                                                          @RequestParam(value = "captchaToken", required = false) String captchaToken,
                                                                          HttpServletRequest request) {
        humanVerificationService.verify(request, captchaToken);
        return ApiResponse.success(uploadService.uploadMerchantApplicationFile(file));
    }

    @PostMapping("/merchant-applications")
    @Operation(summary = "提交经销商申请")
    public ApiResponse<MerchantApplicationResponse> submitMerchantApplication(@Valid @RequestBody MerchantApplicationRequest request,
                                                                              HttpServletRequest httpRequest) {
        humanVerificationService.verify(httpRequest, request.getCaptchaToken());
        return ApiResponse.success(authService.submitMerchantApplication(request));
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
