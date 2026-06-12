package com.mall.api.modules.admin.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.i18n.entity.I18nTranslation;
import com.mall.api.modules.i18n.service.AdminI18nService;
import com.mall.api.modules.language.entity.Language;
import com.mall.api.modules.publicapi.dto.LocaleCatalog;
import com.mall.api.modules.publicapi.dto.PublicLocale;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "V1总后台多语言管理")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminV1I18nController {

    private final AdminI18nService service;

    public AdminV1I18nController(AdminI18nService service) {
        this.service = service;
    }

    @GetMapping("/languages")
    @Operation(summary = "语言列表")
    @PreAuthorize("@perm.has('i18n:language:view')")
    public ApiResponse<Map<String, Object>> getLanguages(@RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int pageSize) {
        Page<Language> pg = service.getLanguages(keyword, status, page, pageSize);
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("list", pg.getRecords());
        data.put("total", pg.getTotal());
        data.put("page", page);
        data.put("pageSize", pageSize);
        data.put("localeGroups", LocaleCatalog.groupedLocales());
        return ApiResponse.success(data);
    }

    @PostMapping("/languages")
    @Operation(summary = "新增语言")
    @PreAuthorize("@perm.has('i18n:language:add')")
    public ApiResponse<Language> createLanguage(@RequestBody Language language) {
        return ApiResponse.success(service.createLanguage(language));
    }

    @PutMapping("/languages/{id}")
    @Operation(summary = "编辑语言")
    @PreAuthorize("@perm.has('i18n:language:edit')")
    public ApiResponse<Language> updateLanguage(@PathVariable Long id, @RequestBody Language language) {
        return ApiResponse.success(service.updateLanguage(id, language));
    }

    @DeleteMapping("/languages/{id}")
    @Operation(summary = "禁用语言")
    @PreAuthorize("@perm.has('i18n:language:edit')")
    public ApiResponse<Void> deleteLanguage(@PathVariable Long id) {
        service.updateLanguageStatus(id, "DISABLE");
        return ApiResponse.success();
    }

    @GetMapping("/translations")
    @Operation(summary = "翻译列表")
    @PreAuthorize("@perm.has('i18n:translation:view')")
    public ApiResponse<Map<String, Object>> getTranslations(
            @RequestParam(required = false) String locale,
            @RequestParam(required = false, name = "module") String module,
            @RequestParam(required = false, name = "key") String key,
            @RequestParam(required = false) String value,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        PublicLocale resolved = locale == null || locale.isBlank() ? null : LocaleCatalog.resolve(locale);
        String keyword = key != null && !key.isBlank() ? key : value;
        Page<I18nTranslation> pg = service.getTranslations(
                keyword,
                resolved == null ? null : resolved.getCountryCode(),
                resolved == null ? null : resolved.getLanguageCode(),
                module,
                status,
                page,
                pageSize
        );
        return ApiResponse.success(Map.of("list", pg.getRecords(), "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }

    @PostMapping("/translations")
    @Operation(summary = "新增翻译")
    @PreAuthorize("@perm.has('i18n:translation:add')")
    public ApiResponse<I18nTranslation> createTranslation(@RequestBody Map<String, Object> body) {
        return ApiResponse.success(service.createTranslation(fromBody(body)));
    }

    @PutMapping("/translations/{id}")
    @Operation(summary = "修改翻译")
    @PreAuthorize("@perm.has('i18n:translation:edit')")
    public ApiResponse<I18nTranslation> updateTranslation(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return ApiResponse.success(service.updateTranslation(id, fromBody(body)));
    }

    @DeleteMapping("/translations/{id}")
    @Operation(summary = "删除翻译")
    @PreAuthorize("@perm.has('i18n:translation:delete')")
    public ApiResponse<Void> deleteTranslation(@PathVariable Long id) {
        service.deleteTranslation(id);
        return ApiResponse.success();
    }

    @PostMapping("/translations/batch")
    @Operation(summary = "批量保存翻译")
    @PreAuthorize("@perm.has('i18n:translation:edit')")
    public ApiResponse<Map<String, Integer>> batchSaveTranslations(@RequestBody Map<String, Object> body) {
        return ApiResponse.success(service.batchSaveTranslations(body));
    }

    @PostMapping("/translations/auto-translate")
    @Operation(summary = "一键翻译/补齐目标语言")
    @PreAuthorize("@perm.has('i18n:translation:edit')")
    public ApiResponse<Map<String, Object>> autoTranslate(@RequestBody Map<String, Object> body) {
        return ApiResponse.success(service.autoTranslate(body));
    }

    @PostMapping("/translations/import")
    @Operation(summary = "导入翻译")
    @PreAuthorize("@perm.has('i18n:translation:add')")
    public ApiResponse<Map<String, Integer>> importTranslations(@RequestBody Map<String, Object> body) {
        String locale = str(body.get("locale"));
        PublicLocale l = LocaleCatalog.resolve(locale);
        String module = str(body.getOrDefault("module", body.get("namespaceCode")));
        boolean overwrite = Boolean.TRUE.equals(body.get("overwrite"));
        @SuppressWarnings("unchecked")
        Map<String, String> messages = (Map<String, String>) body.get("messages");
        return ApiResponse.success(service.importTranslations(l.getCountryCode(), l.getLanguageCode(), module, overwrite, messages));
    }

    @GetMapping("/translations/export")
    @Operation(summary = "导出翻译")
    @PreAuthorize("@perm.has('i18n:translation:view')")
    public ApiResponse<Map<String, Object>> exportTranslations(@RequestParam String locale,
                                                               @RequestParam(required = false, name = "module") String module) {
        PublicLocale l = LocaleCatalog.resolve(locale);
        return ApiResponse.success(service.exportTranslations(l.getCountryCode(), l.getLanguageCode(), module));
    }

    private I18nTranslation fromBody(Map<String, Object> body) {
        I18nTranslation t = new I18nTranslation();
        String locale = str(body.get("locale"));
        if (!locale.isBlank()) {
            PublicLocale l = LocaleCatalog.resolve(locale);
            t.setCountryCode(l.getCountryCode());
            t.setLanguageCode(l.getLanguageCode());
        }
        if (body.get("countryCode") != null) t.setCountryCode(str(body.get("countryCode")));
        if (body.get("languageCode") != null) t.setLanguageCode(str(body.get("languageCode")));
        t.setNamespaceCode(str(body.getOrDefault("module", body.getOrDefault("namespaceCode", "common"))));
        t.setTranslationKey(str(body.getOrDefault("key", body.get("translationKey"))));
        t.setTextValue(str(body.getOrDefault("value", body.get("textValue"))));
        t.setDescription(str(body.get("description")));
        if (body.get("enabled") != null) t.setStatus(Boolean.TRUE.equals(body.get("enabled")) ? "ENABLE" : "DISABLE");
        if (body.get("status") != null) t.setStatus(str(body.get("status")));
        return t;
    }

    private String str(Object o) { return o == null ? "" : String.valueOf(o).trim(); }
}
