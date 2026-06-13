package com.mall.api.modules.publicapi.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.country.entity.Country;
import com.mall.api.modules.country.entity.CountryLanguage;
import com.mall.api.modules.country.mapper.CountryLanguageMapper;
import com.mall.api.modules.country.mapper.CountryMapper;
import com.mall.api.modules.i18n.service.I18nService;
import com.mall.api.modules.language.entity.Language;
import com.mall.api.modules.language.mapper.LanguageMapper;
import com.mall.api.modules.publicapi.dto.LocaleCatalog;
import com.mall.api.modules.publicapi.dto.PublicLocale;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/public")
@Tag(name = "V1公开多语言接口")
public class PublicV1I18nController {

    private static final List<String> PUBLIC_DEFAULT_MODULES = List.of(
            "website", "mall", "common", "auth", "product", "order", "payment", "user", "support", "coupon", "review", "notification", "error"
    );

    private final I18nService i18nService;
    private final CountryMapper countryMapper;
    private final LanguageMapper languageMapper;
    private final CountryLanguageMapper countryLanguageMapper;

    public PublicV1I18nController(I18nService i18nService,
                                  CountryMapper countryMapper,
                                  LanguageMapper languageMapper,
                                  CountryLanguageMapper countryLanguageMapper) {
        this.i18nService = i18nService;
        this.countryMapper = countryMapper;
        this.languageMapper = languageMapper;
        this.countryLanguageMapper = countryLanguageMapper;
    }

    @GetMapping("/languages")
    @Operation(summary = "获取已启用地区语言列表")
    public ApiResponse<Map<String, Object>> getLanguages(HttpServletResponse response) {
        noStore(response);
        List<PublicLocale> locales = resolveEnabledLocales();
        List<String> regions = resolveRegions(locales);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("defaultLocale", resolveDefaultLocale(locales));
        data.put("regions", regions);
        data.put("groups", groupLocales(locales, regions));
        data.put("list", locales);
        data.put("source", locales == LocaleCatalog.LOCALES ? "static" : "admin");
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
        PublicLocale resolved = resolveLocale(locale);
        List<String> modules = parseModules(module);
        Map<String, String> messages = i18nService.getMessages(resolved.getCountryCode(), resolved.getLanguageCode(), modules);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("locale", resolved.getLocale());
        data.put("countryCode", resolved.getCountryCode());
        data.put("languageCode", resolved.getLanguageCode());
        data.put("fallbackLocale", "en-US");
        data.put("modules", modules);
        data.put("messages", messages);
        data.put("translations", messages);
        data.put("source", "admin");
        data.put("updatedAt", System.currentTimeMillis());
        return ApiResponse.success(data);
    }

    private List<PublicLocale> resolveEnabledLocales() {
        try {
            List<Country> countries = countryMapper.selectList(new LambdaQueryWrapper<Country>()
                    .eq(Country::getStatus, "ENABLE")
                    .eq(Country::getDeleted, false)
                    .orderByAsc(Country::getSort, Country::getCode));
            if (countries == null || countries.isEmpty()) return LocaleCatalog.LOCALES;

            List<PublicLocale> result = new ArrayList<>();
            for (Country country : countries) {
                List<LanguageItem> languages = resolveCountryLanguages(country);
                int countrySort = country.getSort() == null ? 999 : country.getSort();
                for (LanguageItem item : languages) {
                    String locale = buildLocale(country.getCode(), item.language.getCode());
                    result.add(new PublicLocale(
                            locale,
                            safeText(country.getName(), country.getCode()),
                            safeText(item.language.getNativeName(), safeText(item.language.getName(), item.language.getCode())),
                            country.getCode(),
                            item.language.getCode(),
                            safeText(country.getRegion(), "Other Countries and Regions"),
                            true,
                            item.isDefault,
                            countrySort * 100 + (item.language.getSort() == null ? 0 : item.language.getSort())
                    ));
                }
            }
            result.sort(Comparator.comparing((PublicLocale l) -> l.getSortOrder() == null ? 99999 : l.getSortOrder())
                    .thenComparing(PublicLocale::getCountryCode)
                    .thenComparing(PublicLocale::getLanguageCode));
            return result.isEmpty() ? LocaleCatalog.LOCALES : result;
        } catch (Exception e) {
            return LocaleCatalog.LOCALES;
        }
    }

    private List<LanguageItem> resolveCountryLanguages(Country country) {
        List<LanguageItem> result = new ArrayList<>();
        Set<String> added = new HashSet<>();
        List<CountryLanguage> links = countryLanguageMapper.selectByCountryId(country.getId());
        if (links != null) {
            for (CountryLanguage link : links) {
                Language language = languageMapper.selectById(link.getLanguageId());
                if (isEnabledLanguage(language) && added.add(language.getCode())) {
                    result.add(new LanguageItem(language, Boolean.TRUE.equals(link.getIsDefault())
                            || language.getCode().equals(country.getDefaultLanguageCode())));
                }
            }
        }

        String defaultLanguageCode = country.getDefaultLanguageCode();
        if (defaultLanguageCode != null && !defaultLanguageCode.isBlank() && !added.contains(defaultLanguageCode)) {
            Language language = languageMapper.selectByCode(defaultLanguageCode);
            if (isEnabledLanguage(language) && added.add(language.getCode())) {
                result.add(0, new LanguageItem(language, true));
            }
        }

        if (result.isEmpty()) {
            Language en = languageMapper.selectByCode("en");
            if (isEnabledLanguage(en)) result.add(new LanguageItem(en, true));
        }
        return result;
    }

    private boolean isEnabledLanguage(Language language) {
        return language != null && "ENABLE".equals(language.getStatus()) && !Boolean.TRUE.equals(language.getDeleted());
    }

    private PublicLocale resolveLocale(String locale) {
        String normalized = LocaleCatalog.normalizeLocale(locale);
        return resolveEnabledLocales().stream()
                .filter(item -> item.getLocale().equalsIgnoreCase(normalized) || item.getLocale().equalsIgnoreCase(locale))
                .findFirst()
                .orElse(LocaleCatalog.resolve(locale));
    }

    private List<String> resolveRegions(List<PublicLocale> locales) {
        List<String> regions = new ArrayList<>();
        for (String region : LocaleCatalog.REGION_ORDER) {
            if (locales.stream().anyMatch(item -> region.equals(item.getRegion()))) regions.add(region);
        }
        for (PublicLocale locale : locales) {
            if (locale.getRegion() != null && !regions.contains(locale.getRegion())) regions.add(locale.getRegion());
        }
        return regions.isEmpty() ? LocaleCatalog.REGION_ORDER : regions;
    }

    private List<Map<String, Object>> groupLocales(List<PublicLocale> locales, List<String> regions) {
        List<Map<String, Object>> groups = new ArrayList<>();
        for (String region : regions) {
            List<PublicLocale> items = locales.stream().filter(l -> region.equals(l.getRegion())).toList();
            if (items.isEmpty()) continue;
            Map<String, Object> group = new LinkedHashMap<>();
            group.put("region", region);
            group.put("items", items);
            groups.add(group);
        }
        return groups;
    }

    private String resolveDefaultLocale(List<PublicLocale> locales) {
        return locales.stream().filter(l -> Boolean.TRUE.equals(l.getIsDefault()))
                .map(PublicLocale::getLocale)
                .findFirst()
                .orElse(locales.isEmpty() ? "en-US" : locales.get(0).getLocale());
    }

    private String buildLocale(String countryCode, String languageCode) {
        String cc = countryCode == null ? "US" : countryCode.toUpperCase();
        String lc = languageCode == null ? "en" : languageCode.replace('_', '-');
        if (lc.equalsIgnoreCase("zh-Hans")) return "CN".equals(cc) ? "zh-CN" : "zh-Hans";
        if (lc.equalsIgnoreCase("zh-Hant")) {
            return switch (cc) {
                case "TW" -> "zh-TW";
                case "MO" -> "zh-MO";
                default -> "zh-HK";
            };
        }
        if (lc.equalsIgnoreCase("pt-BR")) return "pt-BR";
        if (lc.contains("-")) return LocaleCatalog.normalizeLocale(lc);
        return lc.toLowerCase() + "-" + cc;
    }

    private String safeText(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
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
        response.setHeader("CDN-Cache-Control", "no-store");
        response.setHeader("Pragma", "no-cache");
    }

    private record LanguageItem(Language language, boolean isDefault) {}
}
