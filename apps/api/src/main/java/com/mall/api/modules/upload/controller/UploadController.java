package com.mall.api.modules.upload.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.upload.UploadService;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@Tag(name = "文件上传")
@PreAuthorize("isAuthenticated()")
public class UploadController {

    private final UploadService uploadService;

    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping("/image")
    @Operation(summary = "上传图片")
    public ApiResponse<Map<String, Object>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("bizType") String bizType) {
        Long uploaderId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(uploadService.uploadImage(file, bizType, uploaderId));
    }
}
