package com.mall.api.modules.publicapi.dto;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public final class LocaleCatalog {
    private LocaleCatalog() {}

    public static final List<String> REGION_ORDER = List.of(
            "Asia Pacific",
            "Europe",
            "Middle East",
            "North America",
            "South America",
            "Other Countries and Regions"
    );

    public static final List<PublicLocale> LOCALES = List.of(
            // Asia Pacific
            l("zh-CN", "中国大陆", "简体中文", "CN", "zh-Hans", "Asia Pacific", true, 1),
            l("zh-HK", "中國香港", "繁體中文", "HK", "zh-Hant", "Asia Pacific", true, 2),
            l("en-HK", "Hong Kong, China", "English", "HK", "en", "Asia Pacific", false, 3),
            l("en-ID", "Indonesia", "English", "ID", "en", "Asia Pacific", true, 4),
            l("ja-JP", "日本", "日本語", "JP", "ja", "Asia Pacific", true, 5),
            l("zh-MO", "中國澳門", "繁體中文", "MO", "zh-Hant", "Asia Pacific", true, 6),
            l("en-SG", "Singapore", "English", "SG", "en", "Asia Pacific", true, 7),
            l("ko-KR", "대한민국", "한국어", "KR", "ko", "Asia Pacific", true, 8),
            l("zh-TW", "中國台灣", "繁體中文", "TW", "zh-Hant", "Asia Pacific", true, 9),
            l("en-AU", "Australia", "English", "AU", "en", "Asia Pacific", true, 10),
            l("en-NZ", "New Zealand", "English", "NZ", "en", "Asia Pacific", true, 11),
            // Europe
            l("de-AT", "Österreich", "Deutsch", "AT", "de", "Europe", true, 20),
            l("ru-RU", "Россия", "Pусский", "RU", "ru", "Europe", true, 21),
            l("en-BE", "Belgium", "English", "BE", "en", "Europe", true, 22),
            l("en-BG", "Bulgaria", "English", "BG", "en", "Europe", true, 23),
            l("en-HR", "Croatia", "English", "HR", "en", "Europe", true, 24),
            l("en-CZ", "Czech Republic", "English", "CZ", "en", "Europe", true, 25),
            l("en-DK", "Denmark", "English", "DK", "en", "Europe", true, 26),
            l("en-EE", "Estonia", "English", "EE", "en", "Europe", true, 27),
            l("en-FI", "Finland", "English", "FI", "en", "Europe", true, 28),
            l("fr-FR", "France", "Français", "FR", "fr", "Europe", true, 29),
            l("de-DE", "Deutschland", "Deutsch", "DE", "de", "Europe", true, 30),
            l("en-GR", "Greece", "English", "GR", "en", "Europe", true, 31),
            l("en-HU", "Hungary", "English", "HU", "en", "Europe", true, 32),
            l("en-IE", "Ireland", "English", "IE", "en", "Europe", true, 33),
            l("it-IT", "Italia", "Italiano", "IT", "it", "Europe", true, 34),
            l("en-LV", "Latvia", "English", "LV", "en", "Europe", true, 35),
            l("de-LI", "Liechtenstein", "Deutsch", "LI", "de", "Europe", true, 36),
            l("en-LT", "Lithuania", "English", "LT", "en", "Europe", true, 37),
            l("fr-LU", "Luxembourg", "Français", "LU", "fr", "Europe", true, 38),
            l("en-MT", "Malta", "English", "MT", "en", "Europe", true, 39),
            l("fr-MC", "Monaco", "Français", "MC", "fr", "Europe", true, 40),
            l("en-NL", "Netherlands", "English", "NL", "en", "Europe", true, 41),
            l("en-NO", "Norway", "English", "NO", "en", "Europe", true, 42),
            l("en-PL", "Poland", "English", "PL", "en", "Europe", true, 43),
            l("en-PT", "Portugal", "English", "PT", "en", "Europe", true, 44),
            l("en-SK", "Slovakia", "English", "SK", "en", "Europe", true, 45),
            l("en-SI", "Slovenia", "English", "SI", "en", "Europe", true, 46),
            l("es-ES", "España", "Español", "ES", "es", "Europe", true, 47),
            l("en-SE", "Sweden", "English", "SE", "en", "Europe", true, 48),
            l("en-CH", "Switzerland", "English", "CH", "en", "Europe", true, 49),
            l("en-GB", "United Kingdom", "English", "GB", "en", "Europe", true, 50),
            // Middle East
            l("en-AE", "UAE", "English", "AE", "en", "Middle East", true, 60),
            // North America
            l("en-CA", "Canada", "English", "CA", "en", "North America", true, 70),
            l("fr-CA", "Canada", "Français", "CA", "fr", "North America", false, 71),
            l("en-PR", "Puerto Rico", "English", "PR", "en", "North America", true, 72),
            l("en-US", "United States", "English", "US", "en", "North America", true, 73),
            l("es-MX", "México", "Español", "MX", "es", "North America", true, 74),
            // South America
            l("pt-BR", "Brasil", "Português (BR)", "BR", "pt-BR", "South America", true, 80),
            // Other
            l("en-001", "Other Regions", "English", "001", "en", "Other Countries and Regions", true, 999)
    );

    private static PublicLocale l(String locale, String country, String language, String countryCode, String languageCode,
                                  String region, boolean isDefault, int sort) {
        return new PublicLocale(locale, country, language, countryCode, languageCode, region, true, isDefault, sort);
    }

    public static Optional<PublicLocale> find(String locale) {
        if (locale == null || locale.isBlank()) return Optional.empty();
        String normalized = normalizeLocale(locale);
        return LOCALES.stream().filter(l -> l.getLocale().equalsIgnoreCase(normalized)).findFirst();
    }

    public static PublicLocale resolve(String locale) {
        return find(locale).orElseGet(() -> find("en-US").orElse(LOCALES.get(0)));
    }

    public static String normalizeLocale(String raw) {
        if (raw == null || raw.isBlank()) return "en-US";
        String s = raw.trim().replace('_', '-');
        if (s.equalsIgnoreCase("zh-Hans") || s.equalsIgnoreCase("zh-CN")) return "zh-CN";
        if (s.equalsIgnoreCase("zh-Hant") || s.equalsIgnoreCase("zh-HK")) return "zh-HK";
        if (s.equalsIgnoreCase("pt-br")) return "pt-BR";
        String[] parts = s.split("-");
        if (parts.length == 1) {
            return switch (parts[0].toLowerCase()) {
                case "zh" -> "zh-CN";
                case "ja" -> "ja-JP";
                case "ko" -> "ko-KR";
                case "de" -> "de-DE";
                case "fr" -> "fr-FR";
                case "es" -> "es-ES";
                case "it" -> "it-IT";
                case "ru" -> "ru-RU";
                case "pt" -> "pt-BR";
                default -> "en-US";
            };
        }
        return parts[0].toLowerCase() + "-" + parts[1].toUpperCase();
    }

    public static List<Map<String, Object>> groupedLocales() {
        List<Map<String, Object>> groups = new ArrayList<>();
        for (String region : REGION_ORDER) {
            List<PublicLocale> items = LOCALES.stream().filter(l -> region.equals(l.getRegion())).toList();
            Map<String, Object> group = new LinkedHashMap<>();
            group.put("region", region);
            group.put("items", items);
            groups.add(group);
        }
        return groups;
    }
}
