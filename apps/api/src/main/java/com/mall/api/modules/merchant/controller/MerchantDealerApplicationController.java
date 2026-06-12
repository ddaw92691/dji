package com.mall.api.modules.merchant.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.auth.dto.MerchantApplicationRequest;
import com.mall.api.modules.auth.dto.MerchantApplicationResponse;
import com.mall.api.modules.auth.service.AuthService;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.entity.MerchantApplication;
import com.mall.api.modules.merchant.mapper.MerchantApplicationMapper;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.upload.UploadService;
import com.mall.api.security.HumanVerificationService;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/merchant")
@Tag(name = "Merchant Dealer Applications")
public class MerchantDealerApplicationController {

    private final AuthService authService;
    private final UploadService uploadService;
    private final MerchantApplicationMapper applicationMapper;
    private final MerchantMapper merchantMapper;
    private final HumanVerificationService humanVerificationService;

    public MerchantDealerApplicationController(AuthService authService,
                                               UploadService uploadService,
                                               MerchantApplicationMapper applicationMapper,
                                               MerchantMapper merchantMapper,
                                               HumanVerificationService humanVerificationService) {
        this.authService = authService;
        this.uploadService = uploadService;
        this.applicationMapper = applicationMapper;
        this.merchantMapper = merchantMapper;
        this.humanVerificationService = humanVerificationService;
    }

    @PostMapping("/dealer-applications")
    @Operation(summary = "Submit dealer application")
    public ApiResponse<MerchantApplicationResponse> submit(@Valid @RequestBody MerchantApplicationRequest request,
                                                           HttpServletRequest httpRequest) {
        humanVerificationService.verify(httpRequest, request.getCaptchaToken());
        return ApiResponse.success(authService.submitMerchantApplication(request));
    }

    @GetMapping("/dealer-applications/{id}/status")
    @Operation(summary = "Get dealer application public status")
    public ApiResponse<Map<String, Object>> status(@PathVariable Long id) {
        MerchantApplication application = applicationMapper.selectById(id);
        if (application == null || Boolean.TRUE.equals(application.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "Application not found");
        }
        return ApiResponse.success(toStatusMap(application));
    }

    @GetMapping("/dealer-applications/me")
    @PreAuthorize("hasRole('MERCHANT')")
    @Operation(summary = "Get current merchant dealer application status")
    public ApiResponse<Map<String, Object>> me() {
        Long userId = SecurityUtils.getCurrentUserId();
        Merchant merchant = userId == null ? null : merchantMapper.selectByUserId(userId);
        if (merchant == null) {
            throw new BusinessException(ResultCode.FORBIDDEN.getCode(), "Merchant profile not found");
        }
        MerchantApplication application = applicationMapper.selectOne(new LambdaQueryWrapper<MerchantApplication>()
                .eq(MerchantApplication::getMerchantId, merchant.getId())
                .eq(MerchantApplication::getDeleted, false)
                .orderByDesc(MerchantApplication::getCreatedAt)
                .last("LIMIT 1"));
        return ApiResponse.success(application == null ? new LinkedHashMap<>() : toStatusMap(application));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload dealer application file")
    public ApiResponse<Map<String, Object>> upload(@RequestParam("file") MultipartFile file,
                                                   @RequestParam(value = "captchaToken", required = false) String captchaToken,
                                                   HttpServletRequest request) {
        humanVerificationService.verify(request, captchaToken);
        return ApiResponse.success(uploadService.uploadMerchantApplicationFile(file));
    }

    private Map<String, Object> toStatusMap(MerchantApplication application) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", application.getId());
        item.put("status", application.getStatus());
        item.put("reviewRemark", application.getReviewRemark());
        item.put("reviewedAt", application.getReviewedAt());
        item.put("createdAt", application.getCreatedAt());
        item.put("merchantId", application.getMerchantId());
        return item;
    }
}
