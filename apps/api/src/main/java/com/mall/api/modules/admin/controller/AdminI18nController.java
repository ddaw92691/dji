package com.mall.api.modules.admin.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.country.entity.Country;
import com.mall.api.modules.country.entity.CountryLanguage;
import com.mall.api.modules.i18n.entity.I18nNamespace;
import com.mall.api.modules.i18n.entity.I18nTranslation;
import com.mall.api.modules.i18n.service.AdminI18nService;
import com.mall.api.modules.language.entity.Language;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/i18n")
@Tag(name = "Admin国际化管理")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
public class AdminI18nController {

    private final AdminI18nService service;

    public AdminI18nController(AdminI18nService service) { this.service = service; }

    // ==================== Countries ====================

    @GetMapping("/countries")
    @Operation(summary = "国家列表")
    public ApiResponse<Map<String, Object>> getCountries(@RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int pageSize) {
        Page<Country> pg = service.getCountries(keyword, status, page, pageSize);
        return ApiResponse.success(Map.of("list", pg.getRecords(), "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }

    @PostMapping("/countries")
    @Operation(summary = "新增国家")
    public ApiResponse<Country> createCountry(@RequestBody Country country) {
        return ApiResponse.success(service.createCountry(country));
    }

    @PutMapping("/countries/{id}")
    @Operation(summary = "编辑国家")
    public ApiResponse<Country> updateCountry(@PathVariable Long id, @RequestBody Country country) {
        return ApiResponse.success(service.updateCountry(id, country));
    }

    @PutMapping("/countries/{id}/status")
    @Operation(summary = "启用/禁用国家")
    public ApiResponse<Void> updateCountryStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        service.updateCountryStatus(id, body.get("status"));
        return ApiResponse.success();
    }

    @DeleteMapping("/countries/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "删除国家")
    public ApiResponse<Void> deleteCountry(@PathVariable Long id) {
        service.deleteCountry(id);
        return ApiResponse.success();
    }

    // ==================== Languages ====================

    @GetMapping("/languages")
    @Operation(summary = "语言列表")
    public ApiResponse<Map<String, Object>> getLanguages(@RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int pageSize) {
        Page<Language> pg = service.getLanguages(keyword, status, page, pageSize);
        return ApiResponse.success(Map.of("list", pg.getRecords(), "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }

    @PostMapping("/languages")
    @Operation(summary = "新增语言")
    public ApiResponse<Language> createLanguage(@RequestBody Language language) {
        return ApiResponse.success(service.createLanguage(language));
    }

    @PutMapping("/languages/{id}")
    @Operation(summary = "编辑语言")
    public ApiResponse<Language> updateLanguage(@PathVariable Long id, @RequestBody Language language) {
        return ApiResponse.success(service.updateLanguage(id, language));
    }

    @PutMapping("/languages/{id}/status")
    @Operation(summary = "启用/禁用语言")
    public ApiResponse<Void> updateLanguageStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        service.updateLanguageStatus(id, body.get("status"));
        return ApiResponse.success();
    }

    @DeleteMapping("/languages/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "删除语言")
    public ApiResponse<Void> deleteLanguage(@PathVariable Long id) {
        service.deleteLanguage(id);
        return ApiResponse.success();
    }

    // ==================== Country-Languages ====================

    @GetMapping("/country-languages")
    @Operation(summary = "国家语言配置")
    public ApiResponse<List<Map<String, Object>>> getCountryLanguages(@RequestParam(required = false) String countryCode) {
        return ApiResponse.success(service.getCountryLanguages(countryCode));
    }

    @PostMapping("/country-languages")
    @Operation(summary = "绑定国家语言")
    public ApiResponse<CountryLanguage> bindCountryLanguage(@RequestBody Map<String, Object> body) {
        Long countryId = Long.valueOf(body.get("countryId").toString());
        Long languageId = Long.valueOf(body.get("languageId").toString());
        Boolean isDefault = body.containsKey("isDefault") ? (Boolean) body.get("isDefault") : false;
        return ApiResponse.success(service.bindCountryLanguage(countryId, languageId, isDefault));
    }

    @PutMapping("/country-languages/{id}/default")
    @Operation(summary = "设为默认语言")
    public ApiResponse<Void> setDefaultCountryLanguage(@PathVariable Long id) {
        service.setDefaultCountryLanguage(id);
        return ApiResponse.success();
    }

    @DeleteMapping("/country-languages/{id}")
    @Operation(summary = "删除国家语言绑定")
    public ApiResponse<Void> deleteCountryLanguage(@PathVariable Long id) {
        service.deleteCountryLanguage(id);
        return ApiResponse.success();
    }

    // ==================== Namespaces ====================

    @GetMapping("/namespaces")
    @Operation(summary = "命名空间列表")
    public ApiResponse<Map<String, Object>> getNamespaces(@RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "20") int pageSize) {
        Page<I18nNamespace> pg = service.getNamespaces(keyword, status, page, pageSize);
        return ApiResponse.success(Map.of("list", pg.getRecords(), "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }

    @PostMapping("/namespaces")
    @Operation(summary = "新增命名空间")
    public ApiResponse<I18nNamespace> createNamespace(@RequestBody I18nNamespace ns) {
        return ApiResponse.success(service.createNamespace(ns));
    }

    @PutMapping("/namespaces/{id}")
    @Operation(summary = "编辑命名空间")
    public ApiResponse<I18nNamespace> updateNamespace(@PathVariable Long id, @RequestBody I18nNamespace ns) {
        return ApiResponse.success(service.updateNamespace(id, ns));
    }

    @PutMapping("/namespaces/{id}/status")
    @Operation(summary = "启用/禁用命名空间")
    public ApiResponse<Void> updateNamespaceStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        service.updateNamespaceStatus(id, body.get("status"));
        return ApiResponse.success();
    }

    @DeleteMapping("/namespaces/{id}")
    @Operation(summary = "删除命名空间")
    public ApiResponse<Void> deleteNamespace(@PathVariable Long id) {
        service.deleteNamespace(id);
        return ApiResponse.success();
    }

    // ==================== Translations ====================

    @GetMapping("/translations")
    @Operation(summary = "翻译列表")
    public ApiResponse<Map<String, Object>> getTranslations(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String countryCode,
            @RequestParam(required = false) String languageCode,
            @RequestParam(required = false) String namespaceCode,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "20") int pageSize) {
        Page<I18nTranslation> pg = service.getTranslations(keyword, countryCode, languageCode, namespaceCode, status, page, pageSize);
        return ApiResponse.success(Map.of("list", pg.getRecords(), "total", pg.getTotal(), "page", page, "pageSize", pageSize));
    }

    @PostMapping("/translations")
    @Operation(summary = "新增翻译")
    public ApiResponse<I18nTranslation> createTranslation(@RequestBody I18nTranslation t) {
        return ApiResponse.success(service.createTranslation(t));
    }

    @PutMapping("/translations/{id}")
    @Operation(summary = "编辑翻译")
    public ApiResponse<I18nTranslation> updateTranslation(@PathVariable Long id, @RequestBody I18nTranslation t) {
        return ApiResponse.success(service.updateTranslation(id, t));
    }

    @PutMapping("/translations/{id}/status")
    @Operation(summary = "启用/禁用翻译")
    public ApiResponse<Void> updateTranslationStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        service.updateTranslationStatus(id, body.get("status"));
        return ApiResponse.success();
    }

    @DeleteMapping("/translations/{id}")
    @Operation(summary = "删除翻译")
    public ApiResponse<Void> deleteTranslation(@PathVariable Long id) {
        service.deleteTranslation(id);
        return ApiResponse.success();
    }

    @PostMapping("/translations/import")
    @Operation(summary = "批量导入翻译")
    public ApiResponse<Map<String, Integer>> importTranslations(@RequestBody Map<String, Object> body) {
        String countryCode = (String) body.getOrDefault("countryCode", "");
        String languageCode = (String) body.get("languageCode");
        String namespaceCode = (String) body.get("namespaceCode");
        boolean overwrite = Boolean.TRUE.equals(body.get("overwrite"));
        @SuppressWarnings("unchecked")
        Map<String, String> messages = (Map<String, String>) body.get("messages");
        return ApiResponse.success(service.importTranslations(
                countryCode.isEmpty() ? null : countryCode, languageCode, namespaceCode, overwrite, messages));
    }

    @GetMapping("/translations/export")
    @Operation(summary = "导出翻译")
    public ApiResponse<Map<String, Object>> exportTranslations(
            @RequestParam(required = false) String countryCode,
            @RequestParam String languageCode,
            @RequestParam(required = false) String namespaceCode) {
        return ApiResponse.success(service.exportTranslations(countryCode, languageCode, namespaceCode));
    }
}
