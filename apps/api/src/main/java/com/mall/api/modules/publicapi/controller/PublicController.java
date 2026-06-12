package com.mall.api.modules.publicapi.controller;

import com.mall.api.common.response.ApiResponse;
import com.mall.api.modules.country.entity.Country;
import com.mall.api.modules.country.entity.CountryLanguage;
import com.mall.api.modules.country.mapper.CountryLanguageMapper;
import com.mall.api.modules.country.mapper.CountryMapper;
import com.mall.api.modules.i18n.service.I18nService;
import com.mall.api.modules.language.entity.Language;
import com.mall.api.modules.language.mapper.LanguageMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
@Tag(name = "公开接口")
public class PublicController {

    private final CountryMapper countryMapper;
    private final LanguageMapper languageMapper;
    private final CountryLanguageMapper countryLanguageMapper;
    private final I18nService i18nService;

    public PublicController(CountryMapper countryMapper, LanguageMapper languageMapper,
                            CountryLanguageMapper countryLanguageMapper, I18nService i18nService) {
        this.countryMapper = countryMapper;
        this.languageMapper = languageMapper;
        this.countryLanguageMapper = countryLanguageMapper;
        this.i18nService = i18nService;
    }

    @GetMapping("/countries")
    @Operation(summary = "获取启用国家列表")
    public ApiResponse<List<Map<String, Object>>> getCountries() {
        List<Country> countries = countryMapper.selectList(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Country>()
                        .eq(Country::getStatus, "ENABLE")
                        .eq(Country::getDeleted, false)
                        .orderByAsc(Country::getSort));

        List<Map<String, Object>> result = new ArrayList<>();
        for (Country country : countries) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", country.getId());
            item.put("name", country.getName());
            item.put("code", country.getCode());
            item.put("flagIcon", country.getFlagIcon());
            item.put("phoneCode", country.getPhoneCode());
            item.put("defaultLanguageCode", country.getDefaultLanguageCode());
            item.put("currencyCode", country.getCurrencyCode());
            item.put("currencySymbol", country.getCurrencySymbol());
            item.put("timezone", country.getTimezone());
            item.put("region", country.getRegion());

            item.put("languages", resolveCountryLanguages(country));
            result.add(item);
        }
        return ApiResponse.success(result);
    }

    @GetMapping("/countries/{countryCode}/languages")
    @Operation(summary = "获取某国家支持的语言")
    public ApiResponse<List<Map<String, Object>>> getCountryLanguages(@PathVariable String countryCode) {
        Country country = countryMapper.selectByCode(countryCode.toUpperCase());
        if (country == null) {
            return ApiResponse.success(Collections.emptyList());
        }

        return ApiResponse.success(resolveCountryLanguages(country));
    }

    private List<Map<String, Object>> resolveCountryLanguages(Country country) {
        List<CountryLanguage> cls = countryLanguageMapper.selectByCountryId(country.getId());
        List<Map<String, Object>> result = new ArrayList<>();
        Set<String> addedCodes = new HashSet<>();
        for (CountryLanguage cl : cls) {
            Language lang = languageMapper.selectById(cl.getLanguageId());
            if (lang != null && "ENABLE".equals(lang.getStatus())) {
                result.add(languageItem(lang, Boolean.TRUE.equals(cl.getIsDefault())));
                addedCodes.add(lang.getCode());
            }
        }

        String defaultLanguageCode = country.getDefaultLanguageCode();
        if (defaultLanguageCode != null && !defaultLanguageCode.isBlank() && !addedCodes.contains(defaultLanguageCode)) {
            Language lang = languageMapper.selectByCode(defaultLanguageCode);
            if (lang != null && "ENABLE".equals(lang.getStatus())) {
                result.add(0, languageItem(lang, true));
            }
        }
        return result;
    }

    private Map<String, Object> languageItem(Language lang, boolean isDefault) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("code", lang.getCode());
        item.put("name", lang.getName());
        item.put("nativeName", lang.getNativeName());
        item.put("isDefault", isDefault);
        return item;
    }

    @GetMapping("/i18n")
    @Operation(summary = "获取语言包")
    public ApiResponse<Map<String, Object>> getI18n(
            @RequestParam String countryCode,
            @RequestParam String languageCode,
            @RequestParam String namespaces) {
        List<String> nsList = Arrays.stream(namespaces.split(","))
        .map(String::trim)
        .filter(s -> !s.isEmpty() && s.matches("[A-Za-z0-9_.-]+"))
        .distinct()
        .collect(java.util.stream.Collectors.toList());
        Map<String, String> messages = i18nService.getMessages(countryCode, languageCode, nsList);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("languageCode", languageCode);
        result.put("countryCode", countryCode);
        result.put("fallbackLanguageCode", "en");
        result.put("messages", messages);

        return ApiResponse.success(result);
    }
}
