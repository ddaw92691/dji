package com.mall.api.modules.upload;

import com.mall.api.common.exception.BusinessException;
import com.mall.api.modules.system.SystemSettingService;
import com.mall.api.modules.upload.entity.FileResource;
import com.mall.api.modules.upload.mapper.FileResourceMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class UploadService {

    private final FileResourceMapper fileResourceMapper;
    private final SystemSettingService systemSettingService;

    private static final Set<String> DEFAULT_ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp");
    private static final Set<String> MERCHANT_APPLICATION_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp", "mp4", "mov", "webm");
    private static final Set<String> ALLOWED_BIZ_TYPES = Set.of("product", "avatar", "banner", "category", "review", "support", "common", "recharge_proof");
    private static final long DEFAULT_MAX_SIZE = 5 * 1024 * 1024;
    private static final long MERCHANT_APPLICATION_MAX_SIZE = 50 * 1024 * 1024;

    public UploadService(FileResourceMapper fileResourceMapper, SystemSettingService systemSettingService) {
        this.fileResourceMapper = fileResourceMapper;
        this.systemSettingService = systemSettingService;
    }

    public Map<String, Object> uploadImage(MultipartFile file, String bizType, Long uploaderId) {
        if (bizType == null || !ALLOWED_BIZ_TYPES.contains(bizType)) {
            throw new BusinessException(400, "Invalid business type");
        }
        return storeFile(file, bizType, uploaderId, getAllowedExtensions(), getMaxFileSize(), true);
    }

    public Map<String, Object> uploadMerchantApplicationFile(MultipartFile file) {
        return storeFile(file, "merchant_application", null, MERCHANT_APPLICATION_EXTENSIONS, MERCHANT_APPLICATION_MAX_SIZE, false);
    }

    private Map<String, Object> storeFile(MultipartFile file, String bizType, Long uploaderId,
                                          Set<String> allowedExtensions, long maxSize, boolean imageOnly) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new BusinessException(400, "File name is required");
        }

        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex + 1).toLowerCase();
        }

        if (!allowedExtensions.contains(extension)) {
            throw new BusinessException(400, "Unsupported file type: " + extension);
        }
        if (file.getSize() > maxSize) {
            throw new BusinessException(400, "File size exceeds limit: " + (maxSize / 1024 / 1024) + "MB");
        }

        String contentType = file.getContentType();
        if (imageOnly && (contentType == null || !contentType.toLowerCase().startsWith("image/"))) {
            throw new BusinessException(400, "Only image files are allowed");
        }
        if (!imageOnly && contentType != null) {
            String lowerContentType = contentType.toLowerCase();
            if (!lowerContentType.startsWith("image/") && !lowerContentType.startsWith("video/")) {
                throw new BusinessException(400, "Only image or video files are allowed");
            }
        }

        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String fileName = UUID.randomUUID().toString().replace("-", "") + "." + extension;
        Path base = Paths.get("uploads").toAbsolutePath().normalize();
        Path target = base.resolve(bizType).resolve(dateStr).resolve(fileName).normalize();
        if (!target.startsWith(base)) {
            throw new BusinessException(400, "Invalid upload path");
        }

        String filePath = "uploads/" + bizType + "/" + dateStr + "/" + fileName;
        try {
            Files.createDirectories(target.getParent());
            file.transferTo(target.toFile());
        } catch (IOException e) {
            throw new BusinessException(500, "Failed to save file: " + e.getMessage());
        }

        FileResource resource = new FileResource();
        resource.setOriginalName(originalFilename);
        resource.setFileName(fileName);
        resource.setFileUrl("/" + filePath);
        resource.setFilePath(filePath);
        resource.setFileSize(file.getSize());
        resource.setMimeType(file.getContentType());
        resource.setExtension(extension);
        resource.setBizType(bizType);
        resource.setUploaderId(uploaderId);
        resource.setCreatedAt(LocalDateTime.now());
        resource.setDeleted(false);
        fileResourceMapper.insert(resource);

        Map<String, Object> result = new HashMap<>();
        result.put("id", resource.getId());
        result.put("url", resource.getFileUrl());
        result.put("fileName", resource.getFileName());
        result.put("originalName", resource.getOriginalName());
        result.put("size", resource.getFileSize());
        result.put("mimeType", resource.getMimeType());
        result.put("extension", resource.getExtension());
        return result;
    }

    private Set<String> getAllowedExtensions() {
        String val = systemSettingService.getSetting("upload_allowed_extensions");
        if (val != null && !val.isBlank()) {
            Set<String> set = new HashSet<>();
            for (String ext : val.split(",")) {
                String trimmed = ext.trim().toLowerCase();
                if (!trimmed.isEmpty()) {
                    set.add(trimmed);
                }
            }
            if (!set.isEmpty()) {
                return set;
            }
        }
        return DEFAULT_ALLOWED_EXTENSIONS;
    }

    private long getMaxFileSize() {
        String val = systemSettingService.getSetting("upload_max_size");
        if (val != null && !val.isBlank()) {
            try {
                return Long.parseLong(val) * 1024 * 1024;
            } catch (NumberFormatException ignored) {
            }
        }
        return DEFAULT_MAX_SIZE;
    }
}
