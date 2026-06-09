package com.mall.api.modules.i18n.service;

import com.mall.api.modules.i18n.entity.I18nTranslation;
import com.mall.api.modules.i18n.mapper.I18nTranslationMapper;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class I18nService {

    private final I18nTranslationMapper translationMapper;
    private final Map<String, Map<String, String>> cache = new ConcurrentHashMap<>();

    public I18nService(I18nTranslationMapper translationMapper) {
        this.translationMapper = translationMapper;
    }

    public Map<String, String> getMessages(String countryCode, String languageCode, List<String> namespaces) {
        if (namespaces == null || namespaces.isEmpty()) {
            return new LinkedHashMap<>();
        }
        String cacheKey = countryCode + "_" + languageCode + "_" + String.join(",", namespaces);
        Map<String, String> cached = cache.get(cacheKey);
        if (cached != null) return new LinkedHashMap<>(cached);

        List<I18nTranslation> translations = translationMapper.selectByNsListAndLang(namespaces, languageCode, countryCode);

        Map<String, String> messages = new LinkedHashMap<>();
        Set<String> foundKeys = new HashSet<>();

        for (I18nTranslation t : translations) {
            String fullKey = t.getNamespaceCode() + "." + t.getTranslationKey();
            messages.put(fullKey, t.getTextValue());
            foundKeys.add(fullKey);
        }

        if (!"en".equals(languageCode)) {
            List<I18nTranslation> genericTranslations = translationMapper.selectByNsListAndLangOnly(namespaces, languageCode);
            for (I18nTranslation t : genericTranslations) {
                String fullKey = t.getNamespaceCode() + "." + t.getTranslationKey();
                if (!foundKeys.contains(fullKey)) {
                    messages.put(fullKey, t.getTextValue());
                    foundKeys.add(fullKey);
                }
            }
            List<I18nTranslation> fallbackTranslations = translationMapper.selectByNsListAndLangOnly(namespaces, "en");
            for (I18nTranslation t : fallbackTranslations) {
                String fullKey = t.getNamespaceCode() + "." + t.getTranslationKey();
                if (!foundKeys.contains(fullKey)) {
                    messages.put(fullKey, t.getTextValue());
                }
            }
        }

        cache.put(cacheKey, new LinkedHashMap<>(messages));
        return messages;
    }

    public String translate(String errorCode, String countryCode, String languageCode) {
        int lastDot = errorCode.lastIndexOf('.');
        if (lastDot <= 0) return errorCode;
        String namespaceCode = errorCode.substring(0, lastDot);
        Map<String, String> messages = getMessages(countryCode, languageCode, Collections.singletonList(namespaceCode));
        return messages.getOrDefault(errorCode, errorCode);
    }

    public void clearCache() {
        cache.clear();
    }
}
