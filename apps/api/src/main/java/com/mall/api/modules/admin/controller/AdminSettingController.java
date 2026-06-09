package com.mall.api.modules.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.system.entity.SystemSetting;
import com.mall.api.modules.system.mapper.SystemSettingMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/settings")
@Tag(name = "管理员系统设置")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminSettingController {

    private final SystemSettingMapper systemSettingMapper;

    public AdminSettingController(SystemSettingMapper systemSettingMapper) {
        this.systemSettingMapper = systemSettingMapper;
    }

    @GetMapping
    @Operation(summary = "设置列表")
    public ApiResponse<Map<String, Object>> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        LambdaQueryWrapper<SystemSetting> wrapper = Wrappers.<SystemSetting>lambdaQuery()
                .eq(SystemSetting::getDeleted, false)
                .orderByDesc(SystemSetting::getUpdatedAt);
        if (keyword != null && !keyword.isBlank()) {
            wrapper.and(w -> w.like(SystemSetting::getSettingKey, keyword)
                    .or().like(SystemSetting::getDescription, keyword));
        }
        Page<SystemSetting> pg = systemSettingMapper.selectPage(new Page<>(page, pageSize), wrapper);

        Map<String, Object> result = new HashMap<>();
        result.put("list", pg.getRecords());
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return ApiResponse.success(result);
    }

    @PutMapping("/{key}")
    @Operation(summary = "更新单个设置")
    @Transactional
    public ApiResponse<Void> updateSetting(@PathVariable String key, @RequestBody Map<String, String> body) {
        LambdaQueryWrapper<SystemSetting> wrapper = Wrappers.<SystemSetting>lambdaQuery()
                .eq(SystemSetting::getSettingKey, key);
        SystemSetting setting = systemSettingMapper.selectOne(wrapper);

        if (setting == null) {
            setting = new SystemSetting();
            setting.setSettingKey(key);
            setting.setSettingValue(body.get("value"));
            setting.setDescription(body.getOrDefault("description", ""));
            setting.setDeleted(false);
            setting.setCreatedAt(LocalDateTime.now());
            setting.setUpdatedAt(LocalDateTime.now());
            systemSettingMapper.insert(setting);
        } else {
            setting.setSettingValue(body.get("value"));
            if (body.containsKey("description")) {
                setting.setDescription(body.get("description"));
            }
            setting.setUpdatedAt(LocalDateTime.now());
            systemSettingMapper.updateById(setting);
        }
        return ApiResponse.success();
    }

    @PutMapping
    @Operation(summary = "批量保存设置")
    @Transactional
    public ApiResponse<Void> batchSave(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<Map<String, String>> settings = (List<Map<String, String>>) body.get("settings");
        if (settings != null) {
            for (Map<String, String> s : settings) {
                String key = s.get("key");
                String value = s.get("value");
                String description = s.get("description");
                if (key == null) continue;

                LambdaQueryWrapper<SystemSetting> wrapper = Wrappers.<SystemSetting>lambdaQuery()
                        .eq(SystemSetting::getSettingKey, key);
                SystemSetting setting = systemSettingMapper.selectOne(wrapper);

                if (setting == null) {
                    setting = new SystemSetting();
                    setting.setSettingKey(key);
                    setting.setSettingValue(value);
                    setting.setDescription(description != null ? description : "");
                    setting.setDeleted(false);
                    setting.setCreatedAt(LocalDateTime.now());
                    setting.setUpdatedAt(LocalDateTime.now());
                    systemSettingMapper.insert(setting);
                } else {
                    setting.setSettingValue(value);
                    if (description != null) {
                        setting.setDescription(description);
                    }
                    setting.setUpdatedAt(LocalDateTime.now());
                    systemSettingMapper.updateById(setting);
                }
            }
        }
        return ApiResponse.success();
    }
}
