package com.mall.api.modules.system.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.enums.ResultCode;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.log.annotation.Audit;
import com.mall.api.modules.log.entity.AuditLog;
import com.mall.api.modules.log.service.AuditLogService;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.entity.MerchantApplication;
import com.mall.api.modules.merchant.mapper.MerchantApplicationMapper;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.system.entity.SysRole;
import com.mall.api.modules.system.entity.SysUserRole;
import com.mall.api.modules.system.mapper.SysRoleMapper;
import com.mall.api.modules.system.mapper.SysUserRoleMapper;
import com.mall.api.modules.upload.entity.FileResource;
import com.mall.api.modules.upload.mapper.FileResourceMapper;
import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import com.mall.api.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/admin/merchant-applications", "/api/v1/admin/merchant-applications"})
@Tag(name = "Admin Merchant Applications")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminMerchantApplicationController {

    private static final String PENDING = "PENDING";
    private static final String APPROVED = "APPROVED";
    private static final String REJECTED = "REJECTED";
    private static final String MERCHANT_ROLE = "MERCHANT";

    private final MerchantApplicationMapper applicationMapper;
    private final UserMapper userMapper;
    private final MerchantMapper merchantMapper;
    private final SysRoleMapper sysRoleMapper;
    private final SysUserRoleMapper sysUserRoleMapper;
    private final AuditLogService auditLogService;
    private final FileResourceMapper fileResourceMapper;

    public AdminMerchantApplicationController(MerchantApplicationMapper applicationMapper,
                                              UserMapper userMapper,
                                              MerchantMapper merchantMapper,
                                              SysRoleMapper sysRoleMapper,
                                              SysUserRoleMapper sysUserRoleMapper,
                                              AuditLogService auditLogService,
                                              FileResourceMapper fileResourceMapper) {
        this.applicationMapper = applicationMapper;
        this.userMapper = userMapper;
        this.merchantMapper = merchantMapper;
        this.sysRoleMapper = sysRoleMapper;
        this.sysUserRoleMapper = sysUserRoleMapper;
        this.auditLogService = auditLogService;
        this.fileResourceMapper = fileResourceMapper;
    }

    @GetMapping
    @Operation(summary = "Merchant application list")
    public ApiResponse<Map<String, Object>> list(@RequestParam(required = false) String keyword,
                                                 @RequestParam(required = false) String status,
                                                 @RequestParam(defaultValue = "1") int page,
                                                 @RequestParam(defaultValue = "10") int pageSize) {
        LambdaQueryWrapper<MerchantApplication> qw = new LambdaQueryWrapper<>();
        qw.eq(MerchantApplication::getDeleted, false);
        if (status != null && !status.isBlank()) {
            qw.eq(MerchantApplication::getStatus, status);
        }
        if (keyword != null && !keyword.isBlank()) {
            qw.and(w -> w.like(MerchantApplication::getEmail, keyword)
                    .or()
                    .like(MerchantApplication::getPhone, keyword)
                    .or()
                    .like(MerchantApplication::getFullName, keyword));
        }
        qw.orderByDesc(MerchantApplication::getCreatedAt);

        Page<MerchantApplication> pg = applicationMapper.selectPage(new Page<>(page, pageSize), qw);
        List<Map<String, Object>> list = new ArrayList<>();
        for (MerchantApplication application : pg.getRecords()) {
            list.add(toMap(application, false));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("list", list);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return ApiResponse.success(result);
    }

    @GetMapping("/pending-count")
    @Operation(summary = "Pending merchant application count")
    public ApiResponse<Map<String, Object>> pendingCount() {
        Long count = applicationMapper.selectCount(new LambdaQueryWrapper<MerchantApplication>()
                .eq(MerchantApplication::getDeleted, false)
                .eq(MerchantApplication::getStatus, PENDING));
        return ApiResponse.success(Map.of("pendingCount", count == null ? 0 : count));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Merchant application detail")
    public ApiResponse<Map<String, Object>> detail(@PathVariable Long id) {
        return ApiResponse.success(toMap(requireApplication(id), true));
    }

    @GetMapping("/by-merchant/{merchantId}")
    @Operation(summary = "Merchant application by merchant id")
    public ApiResponse<Map<String, Object>> byMerchant(@PathVariable Long merchantId) {
        MerchantApplication application = applicationMapper.selectOne(
                new LambdaQueryWrapper<MerchantApplication>()
                        .eq(MerchantApplication::getMerchantId, merchantId)
                        .eq(MerchantApplication::getDeleted, false)
                        .orderByDesc(MerchantApplication::getCreatedAt)
                        .last("LIMIT 1"));
        return ApiResponse.success(application == null ? new LinkedHashMap<>() : toMap(application, true));
    }

    @GetMapping("/{id}/files/{fileId}")
    @Operation(summary = "Download merchant application sensitive file by file id")
    public ResponseEntity<Resource> downloadFileById(@PathVariable Long id,
                                                     @PathVariable Long fileId,
                                                     HttpServletRequest request) {
        MerchantApplication application = requireApplication(id);
        FileResource file = fileResourceMapper.selectById(fileId);
        if (file == null || Boolean.TRUE.equals(file.getDeleted()) || !belongsToApplication(application, file.getFileUrl())) {
            return ResponseEntity.notFound().build();
        }
        recordFileAccessAudit(id, "fileId:" + fileId, request);
        return fileResponse(file.getFilePath());
    }

    @GetMapping("/{id}/file/{field}")
    @Operation(summary = "鉴权下载商家申请敏感证件（图片/视频）")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id,
                                                 @PathVariable String field,
                                                 HttpServletRequest request) {
        MerchantApplication application = requireApplication(id);
        String url = fileUrlByField(application, field);
        if (url == null || url.isBlank()) {
            return ResponseEntity.notFound().build();
        }

        // 解析磁盘路径并做目录越权防护：仅允许 uploads/merchant_application/ 下的文件
        Path base = Paths.get("uploads", "merchant_application").toAbsolutePath().normalize();
        String relative = url.startsWith("/") ? url.substring(1) : url;
        Path target = Paths.get(relative).toAbsolutePath().normalize();
        if (!target.startsWith(base) || !Files.exists(target) || !Files.isReadable(target)) {
            return ResponseEntity.notFound().build();
        }

        recordFileAccessAudit(id, field, request);

        return fileResponse(relative);
    }

    private ResponseEntity<Resource> fileResponse(String relativePath) {
        Path base = Paths.get("uploads", "merchant_application").toAbsolutePath().normalize();
        String relative = relativePath.startsWith("/") ? relativePath.substring(1) : relativePath;
        Path target = Paths.get(relative).toAbsolutePath().normalize();
        if (!target.startsWith(base) || !Files.exists(target) || !Files.isReadable(target)) {
            return ResponseEntity.notFound().build();
        }

        String contentType = "application/octet-stream";
        try {
            String probed = Files.probeContentType(target);
            if (probed != null) contentType = probed;
        } catch (Exception ignored) {
        }

        Resource resource = new FileSystemResource(target);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + target.getFileName().toString() + "\"")
                .body(resource);
    }

    private String fileUrlByField(MerchantApplication a, String field) {
        switch (field) {
            case "idCardFront": return a.getIdCardFrontUrl();
            case "idCardBack": return a.getIdCardBackUrl();
            case "passport": return a.getPassportPageUrl();
            case "driverLicense": return a.getDriverLicenseUrl();
            case "handheldVideo": return a.getHandheldDocumentVideoUrl();
            default: throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Invalid file field");
        }
    }

    private void recordFileAccessAudit(Long applicationId, String field, HttpServletRequest request) {
        try {
            AuditLog audit = new AuditLog();
            audit.setUserId(SecurityUtils.getCurrentUserId());
            audit.setModule("商家申请");
            audit.setAction("查看敏感证件");
            audit.setDescription("application=" + applicationId + ", field=" + field);
            if (request != null) {
                audit.setMethod(request.getMethod());
                audit.setRequestUri(request.getRequestURI());
                audit.setIp(request.getRemoteAddr());
                audit.setUserAgent(request.getHeader("User-Agent"));
            }
            auditLogService.save(audit);
        } catch (Exception ignored) {
            // 审计失败不应阻断正常下载
        }
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve merchant application")
    @Audit(module = "Merchant Application", action = "Approve", description = "Approve merchant application")
    @Transactional
    public ApiResponse<Map<String, Object>> approve(@PathVariable Long id,
                                                    @RequestBody(required = false) Map<String, Object> body) {
        MerchantApplication application = requireApplication(id);
        if (!PENDING.equals(application.getStatus())) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Application is not pending");
        }
        if (userMapper.selectByEmail(application.getEmail()) != null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Email is already registered");
        }
        if (application.getPhone() != null && userMapper.selectByPhone(application.getPhone()) != null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Phone number is already registered");
        }

        LocalDateTime now = LocalDateTime.now();
        String shopName = text(body, "shopName");
        if (shopName == null) {
            shopName = application.getFullName();
        }

        User user = new User();
        user.setUsername(application.getEmail());
        user.setEmail(application.getEmail());
        user.setPhone(application.getPhone());
        user.setPassword(application.getPasswordHash());
        user.setNickname(application.getFullName());
        user.setRole(MERCHANT_ROLE);
        user.setStatus(1);
        user.setCountryCode("US");
        user.setLanguageCode("en");
        user.setDeleted(false);
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        userMapper.insert(user);

        Merchant merchant = new Merchant();
        merchant.setUserId(user.getId());
        merchant.setShopName(shopName);
        merchant.setBalance(BigDecimal.ZERO);
        merchant.setFrozenBalance(BigDecimal.ZERO);
        merchant.setTotalSales(BigDecimal.ZERO);
        merchant.setTotalWithdrawn(BigDecimal.ZERO);
        merchant.setStatus("ENABLE");
        merchant.setDeleted(false);
        merchant.setCreatedAt(now);
        merchant.setUpdatedAt(now);
        merchantMapper.insert(merchant);

        SysRole role = sysRoleMapper.selectOne(
                new LambdaQueryWrapper<SysRole>().eq(SysRole::getCode, MERCHANT_ROLE));
        if (role != null) {
            SysUserRole userRole = new SysUserRole();
            userRole.setUserId(user.getId());
            userRole.setRoleId(role.getId());
            userRole.setCreatedAt(now);
            sysUserRoleMapper.insert(userRole);
        }

        application.setStatus(APPROVED);
        application.setReviewRemark(text(body, "reviewRemark"));
        application.setReviewedBy(SecurityUtils.getCurrentUserId());
        application.setReviewedAt(now);
        application.setUserId(user.getId());
        application.setMerchantId(merchant.getId());
        application.setUpdatedAt(now);
        applicationMapper.updateById(application);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("userId", user.getId());
        result.put("merchantId", merchant.getId());
        return ApiResponse.success(result);
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "Reject merchant application")
    @Audit(module = "Merchant Application", action = "Reject", description = "Reject merchant application")
    @Transactional
    public ApiResponse<Void> reject(@PathVariable Long id,
                                    @RequestBody(required = false) Map<String, Object> body) {
        MerchantApplication application = requireApplication(id);
        if (!PENDING.equals(application.getStatus())) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Application is not pending");
        }
        String reason = text(body, "reviewRemark");
        if (reason == null) {
            reason = text(body, "rejectReason");
        }
        if (reason == null) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "Reject reason is required");
        }
        application.setStatus(REJECTED);
        application.setReviewRemark(reason);
        application.setReviewedBy(SecurityUtils.getCurrentUserId());
        application.setReviewedAt(LocalDateTime.now());
        application.setUpdatedAt(LocalDateTime.now());
        applicationMapper.updateById(application);
        return ApiResponse.success();
    }

    private MerchantApplication requireApplication(Long id) {
        MerchantApplication application = applicationMapper.selectById(id);
        if (application == null || Boolean.TRUE.equals(application.getDeleted())) {
            throw new BusinessException(ResultCode.NOT_FOUND.getCode(), "Application not found");
        }
        return application;
    }

    private Map<String, Object> toMap(MerchantApplication application, boolean includeSensitive) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", application.getId());
        item.put("email", application.getEmail());
        item.put("phone", application.getPhone());
        item.put("fullName", application.getFullName());
        item.put("age", application.getAge());
        item.put("homeAddress", application.getHomeAddress());
        item.put("documentType", application.getDocumentType());
        item.put("status", application.getStatus());
        item.put("reviewRemark", application.getReviewRemark());
        item.put("reviewedBy", application.getReviewedBy());
        item.put("reviewedAt", application.getReviewedAt());
        item.put("userId", application.getUserId());
        item.put("merchantId", application.getMerchantId());
        item.put("createdAt", application.getCreatedAt());
        item.put("updatedAt", application.getUpdatedAt());
        if (includeSensitive) {
            item.put("idCardFrontFile", fileInfo(application, application.getIdCardFrontUrl()));
            item.put("idCardBackFile", fileInfo(application, application.getIdCardBackUrl()));
            item.put("passportFile", fileInfo(application, application.getPassportPageUrl()));
            item.put("driverLicenseFile", fileInfo(application, application.getDriverLicenseUrl()));
            item.put("handheldVideoFile", fileInfo(application, application.getHandheldDocumentVideoUrl()));
        }
        return item;
    }

    private Map<String, Object> fileInfo(MerchantApplication application, String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            return null;
        }
        FileResource file = fileResourceMapper.selectOne(new LambdaQueryWrapper<FileResource>()
                .eq(FileResource::getFileUrl, fileUrl)
                .eq(FileResource::getDeleted, false)
                .last("LIMIT 1"));
        Map<String, Object> info = new LinkedHashMap<>();
        if (file != null) {
            info.put("id", file.getId());
            info.put("originalName", file.getOriginalName());
            info.put("mimeType", file.getMimeType());
            info.put("size", file.getFileSize());
            info.put("accessUrl", "/admin/merchant-applications/" + application.getId() + "/files/" + file.getId());
        } else {
            info.put("accessUrl", "/admin/merchant-applications/" + application.getId() + "/file/" + fieldByUrl(application, fileUrl));
        }
        return info;
    }

    private String fieldByUrl(MerchantApplication application, String fileUrl) {
        if (fileUrl.equals(application.getIdCardFrontUrl())) return "idCardFront";
        if (fileUrl.equals(application.getIdCardBackUrl())) return "idCardBack";
        if (fileUrl.equals(application.getPassportPageUrl())) return "passport";
        if (fileUrl.equals(application.getDriverLicenseUrl())) return "driverLicense";
        if (fileUrl.equals(application.getHandheldDocumentVideoUrl())) return "handheldVideo";
        return "";
    }

    private boolean belongsToApplication(MerchantApplication application, String fileUrl) {
        return fileUrl != null && (
                fileUrl.equals(application.getIdCardFrontUrl())
                        || fileUrl.equals(application.getIdCardBackUrl())
                        || fileUrl.equals(application.getPassportPageUrl())
                        || fileUrl.equals(application.getDriverLicenseUrl())
                        || fileUrl.equals(application.getHandheldDocumentVideoUrl()));
    }

    private String text(Map<String, Object> body, String key) {
        if (body == null || body.get(key) == null) {
            return null;
        }
        String value = String.valueOf(body.get(key)).trim();
        return value.isEmpty() ? null : value;
    }
}
