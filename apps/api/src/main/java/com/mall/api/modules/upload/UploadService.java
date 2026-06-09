package com.mall.api.modules.upload;

import com.mall.api.modules.system.SystemSettingService;
import com.mall.api.modules.upload.entity.FileResource;
import com.mall.api.modules.upload.mapper.FileResourceMapper;
import com.mall.api.common.exception.BusinessException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class UploadService {

    private final FileResourceMapper fileResourceMapper;
    private final SystemSettingService systemSettingService;

    private static final Set<String> DEFAULT_ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp");
    private static final long DEFAULT_MAX_SIZE = 5 * 1024 * 1024;
    private static final Set<String> ALLOWED_BIZ_TYPES = Set.of("product", "avatar", "banner", "category", "review", "support", "common");
    private static final Set<String> FORBIDDEN_EXTENSIONS = Set.of("svg", "html", "htm", "xml", "xhtml", "js", "swf");

    public UploadService(FileResourceMapper fileResourceMapper, SystemSettingService systemSettingService) {
        this.fileResourceMapper = fileResourceMapper;
        this.systemSettingService = systemSettingService;
    }

    public Map<String, Object> uploadImage(MultipartFile file, String bizType, Long uploaderId) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new BusinessException(400, "文件名不能为空");
        }

        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex + 1).toLowerCase();
        }

        Set<String> allowedExtensions = getAllowedExtensions();
        if (!allowedExtensions.contains(extension)) {
            throw new BusinessException(400, "不支持的文件类型: " + extension + "，允许: " + String.join(",", allowedExtensions));
        }

        long maxSize = getMaxFileSize();
        if (file.getSize() > maxSize) {
            throw new BusinessException(400, "文件大小超过限制: " + (maxSize / 1024 / 1024) + "MB");
        }

        if (bizType == null || !ALLOWED_BIZ_TYPES.contains(bizType)) {
            throw new BusinessException(400, "非法的业务类型");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new BusinessException(400, "仅允许上传图片");
        }

        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String uuid = UUID.randomUUID().toString().replace("-", "");
        String fileName = uuid + "." + extension;
        Path base = Paths.get("uploads").toAbsolutePath().normalize();
        Path target = base.resolve(bizType).resolve(dateStr).resolve(fileName).normalize();
        if (!target.startsWith(base)) {
            throw new BusinessException(400, "非法路径");
        }
        String filePath = "uploads/" + bizType + "/" + dateStr + "/" + fileName;
        try {
            Files.createDirectories(target.getParent());
            file.transferTo(target.toFile());
        } catch (IOException e) {
            throw new BusinessException(500, "文件保存失败: " + e.getMessage());
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
