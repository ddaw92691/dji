package com.mall.api.modules.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.log.entity.AuditLog;
import com.mall.api.modules.log.mapper.AuditLogMapper;
import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin/audit-logs")
@Tag(name = "管理员操作日志")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AuditLogController {

    private final AuditLogMapper auditLogMapper;
    private final UserMapper userMapper;

    public AuditLogController(AuditLogMapper auditLogMapper, UserMapper userMapper) {
        this.auditLogMapper = auditLogMapper;
        this.userMapper = userMapper;
    }

    @GetMapping
    @Operation(summary = "操作日志列表")
    @PreAuthorize("@perm.has('sys:audit:view')")
    public ApiResponse<Map<String, Object>> list(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String targetType,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {

        LambdaQueryWrapper<AuditLog> wrapper = Wrappers.<AuditLog>lambdaQuery()
                .orderByDesc(AuditLog::getCreatedAt);

        if (userId != null) {
            wrapper.eq(AuditLog::getUserId, userId);
        }
        if (action != null && !action.isBlank()) {
            wrapper.eq(AuditLog::getAction, action);
        }
        if (targetType != null && !targetType.isBlank()) {
            wrapper.eq(AuditLog::getModule, targetType);
        }
        if (keyword != null && !keyword.isBlank()) {
            wrapper.and(w -> w.like(AuditLog::getDescription, keyword)
                    .or().like(AuditLog::getUsername, keyword));
        }
        if (startDate != null && !startDate.isBlank()) {
            wrapper.ge(AuditLog::getCreatedAt, LocalDateTime.parse(startDate + "T00:00:00"));
        }
        if (endDate != null && !endDate.isBlank()) {
            wrapper.le(AuditLog::getCreatedAt, LocalDateTime.parse(endDate + "T23:59:59"));
        }

        Page<AuditLog> pg = auditLogMapper.selectPage(new Page<>(page, pageSize), wrapper);

        List<Map<String, Object>> list = new ArrayList<>();
        for (AuditLog log : pg.getRecords()) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", log.getId());
            item.put("userId", log.getUserId());
            item.put("username", log.getUsername());
            item.put("module", log.getModule());
            item.put("action", log.getAction());
            item.put("description", log.getDescription());
            item.put("method", log.getMethod());
            item.put("requestUri", log.getRequestUri());
            item.put("requestParams", log.getRequestParams());
            item.put("ip", log.getIp());
            item.put("userAgent", log.getUserAgent());
            item.put("executionTime", log.getExecutionTime());
            item.put("status", log.getStatus());
            item.put("errorMessage", log.getErrorMessage());
            item.put("createdAt", log.getCreatedAt());

            if (log.getUserId() != null) {
                User user = userMapper.selectById(log.getUserId());
                item.put("userEmail", user != null ? user.getEmail() : null);
            }

            list.add(item);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return ApiResponse.success(result);
    }
}
