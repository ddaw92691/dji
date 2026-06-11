package com.mall.api.modules.publicapi.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.i18n.service.I18nService;
import com.mall.api.modules.publicapi.dto.LocaleCatalog;
import com.mall.api.modules.publicapi.dto.PublicLocale;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/public")
@Tag(name = "V1公开多语言接口")
public class PublicV1I18nController {

    private static final List<String> PUBLIC_DEFAULT_MODULES = List.of(
            "website", "mall", "common", "auth", "product", "order", "payment", "user", "support", "coupon", "review", "notification", "error"
    );

    private final I18nService i18nService;

    public PublicV1I18nController(I18nService i18nService) {
        this.i18nService = i18nService;
    }

    @GetMapping("/languages")
    @Operation(summary = "获取已启用地区语言列表")
    public ApiResponse<Map<String, Object>> getLanguages(HttpServletResponse response) {
        noStore(response);
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("defaultLocale", "en-US");
        data.put("regions", LocaleCatalog.REGION_ORDER);
        data.put("groups", LocaleCatalog.groupedLocales());
        data.put("list", LocaleCatalog.LOCALES);
        data.put("updatedAt", System.currentTimeMillis());
        return ApiResponse.success(data);
    }

    @GetMapping("/translations")
    @Operation(summary = "获取指定语言翻译内容")
    public ApiResponse<Map<String, Object>> getTranslations(
            @RequestParam(defaultValue = "en-US") String locale,
            @RequestParam(required = false, name = "module") String module,
            HttpServletResponse response) {
        noStore(response);
        PublicLocale resolved = LocaleCatalog.resolve(locale);
        List<String> modules = parseModules(module);
        Map<String, String> messages = i18nService.getMessages(resolved.getCountryCode(), resolved.getLanguageCode(), modules);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("locale", resolved.getLocale());
        data.put("countryCode", resolved.getCountryCode());
        data.put("languageCode", resolved.getLanguageCode());
        data.put("fallbackLocale", "en-US");
        data.put("modules", modules);
        data.put("messages", messages);
        data.put("updatedAt", System.currentTimeMillis());
        return ApiResponse.success(data);
    }

    private List<String> parseModules(String module) {
        if (module == null || module.isBlank()) return PUBLIC_DEFAULT_MODULES;
        return Arrays.stream(module.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty() && s.matches("[A-Za-z0-9_.-]+"))
                .distinct()
                .collect(Collectors.toList());
    }

    private void noStore(HttpServletResponse response) {
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        response.setHeader("Pragma", "no-cache");
    }
}
