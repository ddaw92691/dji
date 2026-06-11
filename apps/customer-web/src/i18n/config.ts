// 多语言地区配置 —— 与后端 country/language 二元组、商城共用同一套标准
// 官网与商城共用 localStorage key（同域部署时自动同步）

export interface LocaleEntry {
  id: string; // 展示用 locale code，如 zh-CN / en-US
  country: string; // 国家/地区显示名
  language: string; // 语言显示名（nativeName）
  countryCode: string; // 后端 countryCode
  languageCode: string; // 后端 languageCode
  region: string; // 区域分组（英文，与后端 region 一致）
}

export const REGION_ORDER = [
  "Asia Pacific",
  "Europe",
  "Middle East",
  "North America",
  "South America",
  "Other Countries and Regions",
] as const;

export const LOCALES: LocaleEntry[] = [
  // Asia Pacific
  {
    id: "zh-CN",
    country: "中国大陆",
    language: "简体中文",
    countryCode: "CN",
    languageCode: "zh-Hans",
    region: "Asia Pacific",
  },
  {
    id: "zh-HK",
    country: "中國香港",
    language: "繁體中文",
    countryCode: "HK",
    languageCode: "zh-Hant",
    region: "Asia Pacific",
  },
  {
    id: "en-HK",
    country: "Hong Kong, China",
    language: "English",
    countryCode: "HK",
    languageCode: "en",
    region: "Asia Pacific",
  },
  {
    id: "en-ID",
    country: "Indonesia",
    language: "English",
    countryCode: "ID",
    languageCode: "en",
    region: "Asia Pacific",
  },
  {
    id: "ja-JP",
    country: "日本",
    language: "日本語",
    countryCode: "JP",
    languageCode: "ja",
    region: "Asia Pacific",
  },
  {
    id: "zh-MO",
    country: "中國澳門",
    language: "繁體中文",
    countryCode: "MO",
    languageCode: "zh-Hant",
    region: "Asia Pacific",
  },
  {
    id: "en-SG",
    country: "Singapore",
    language: "English",
    countryCode: "SG",
    languageCode: "en",
    region: "Asia Pacific",
  },
  {
    id: "ko-KR",
    country: "대한민국",
    language: "한국어",
    countryCode: "KR",
    languageCode: "ko",
    region: "Asia Pacific",
  },
  {
    id: "zh-TW",
    country: "中國台灣",
    language: "繁體中文",
    countryCode: "TW",
    languageCode: "zh-Hant",
    region: "Asia Pacific",
  },
  {
    id: "en-AU",
    country: "Australia",
    language: "English",
    countryCode: "AU",
    languageCode: "en",
    region: "Asia Pacific",
  },
  {
    id: "en-NZ",
    country: "New Zealand",
    language: "English",
    countryCode: "NZ",
    languageCode: "en",
    region: "Asia Pacific",
  },
  // Europe
  {
    id: "de-AT",
    country: "Österreich",
    language: "Deutsch",
    countryCode: "AT",
    languageCode: "de",
    region: "Europe",
  },
  {
    id: "ru-RU",
    country: "Россия",
    language: "Pусский",
    countryCode: "RU",
    languageCode: "ru",
    region: "Europe",
  },
  {
    id: "en-BE",
    country: "Belgium",
    language: "English",
    countryCode: "BE",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "en-BG",
    country: "Bulgaria",
    language: "English",
    countryCode: "BG",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "en-HR",
    country: "Croatia",
    language: "English",
    countryCode: "HR",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "en-CZ",
    country: "Czech Republic",
    language: "English",
    countryCode: "CZ",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "en-DK",
    country: "Denmark",
    language: "English",
    countryCode: "DK",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "en-EE",
    country: "Estonia",
    language: "English",
    countryCode: "EE",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "en-FI",
    country: "Finland",
    language: "English",
    countryCode: "FI",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "fr-FR",
    country: "France",
    language: "Français",
    countryCode: "FR",
    languageCode: "fr",
    region: "Europe",
  },
  {
    id: "de-DE",
    country: "Deutschland",
    language: "Deutsch",
    countryCode: "DE",
    languageCode: "de",
    region: "Europe",
  },
  {
    id: "en-GR",
    country: "Greece",
    language: "English",
    countryCode: "GR",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "en-HU",
    country: "Hungary",
    language: "English",
    countryCode: "HU",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "en-IE",
    country: "Ireland",
    language: "English",
    countryCode: "IE",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "it-IT",
    country: "Italia",
    language: "Italiano",
    countryCode: "IT",
    languageCode: "it",
    region: "Europe",
  },
  {
    id: "en-LV",
    country: "Latvia",
    language: "English",
    countryCode: "LV",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "de-LI",
    country: "Liechtenstein",
    language: "Deutsch",
    countryCode: "LI",
    languageCode: "de",
    region: "Europe",
  },
  {
    id: "en-LT",
    country: "Lithuania",
    language: "English",
    countryCode: "LT",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "fr-LU",
    country: "Luxembourg",
    language: "Français",
    countryCode: "LU",
    languageCode: "fr",
    region: "Europe",
  },
  {
    id: "en-MT",
    country: "Malta",
    language: "English",
    countryCode: "MT",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "fr-MC",
    country: "Monaco",
    language: "Français",
    countryCode: "MC",
    languageCode: "fr",
    region: "Europe",
  },
  {
    id: "en-NL",
    country: "Netherlands",
    language: "English",
    countryCode: "NL",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "en-NO",
    country: "Norway",
    language: "English",
    countryCode: "NO",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "en-PL",
    country: "Poland",
    language: "English",
    countryCode: "PL",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "en-PT",
    country: "Portugal",
    language: "English",
    countryCode: "PT",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "en-SK",
    country: "Slovakia",
    language: "English",
    countryCode: "SK",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "en-SI",
    country: "Slovenia",
    language: "English",
    countryCode: "SI",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "es-ES",
    country: "España",
    language: "Español",
    countryCode: "ES",
    languageCode: "es",
    region: "Europe",
  },
  {
    id: "en-SE",
    country: "Sweden",
    language: "English",
    countryCode: "SE",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "en-CH",
    country: "Switzerland",
    language: "English",
    countryCode: "CH",
    languageCode: "en",
    region: "Europe",
  },
  {
    id: "en-GB",
    country: "United Kingdom",
    language: "English",
    countryCode: "GB",
    languageCode: "en",
    region: "Europe",
  },
  // Middle East
  {
    id: "en-AE",
    country: "UAE",
    language: "English",
    countryCode: "AE",
    languageCode: "en",
    region: "Middle East",
  },
  // North America
  {
    id: "en-CA",
    country: "Canada",
    language: "English",
    countryCode: "CA",
    languageCode: "en",
    region: "North America",
  },
  {
    id: "fr-CA",
    country: "Canada",
    language: "Français",
    countryCode: "CA",
    languageCode: "fr",
    region: "North America",
  },
  {
    id: "en-PR",
    country: "Puerto Rico",
    language: "English",
    countryCode: "PR",
    languageCode: "en",
    region: "North America",
  },
  {
    id: "en-US",
    country: "United States",
    language: "English",
    countryCode: "US",
    languageCode: "en",
    region: "North America",
  },
  {
    id: "es-MX",
    country: "México",
    language: "Español",
    countryCode: "MX",
    languageCode: "es",
    region: "North America",
  },
  // South America
  {
    id: "pt-BR",
    country: "Brasil",
    language: "Português (BR)",
    countryCode: "BR",
    languageCode: "pt-BR",
    region: "South America",
  },
  // Other
  {
    id: "en-001",
    country: "Other Regions",
    language: "English",
    countryCode: "001",
    languageCode: "en",
    region: "Other Countries and Regions",
  },
];

export const DEFAULT_LOCALE_ID = "en-US";

// 官网/商城共用的 localStorage key（同域部署自动同步）
export const STORAGE_KEYS = {
  locale: "mall_locale",
  countryCode: "mall_countryCode",
  languageCode: "mall_languageCode",
};

export function findLocaleById(id?: string | null): LocaleEntry | undefined {
  if (!id) return undefined;
  return LOCALES.find((l) => l.id === id);
}

// 命名空间：商城用到的语言包模块
export const NAMESPACES =
  "mall,common,auth,customer,error,order,product,payment,user,support,coupon,review,notification";

function detectFromBrowser(): LocaleEntry {
  const langs =
    (navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language]) || [];
  for (const raw of langs) {
    if (!raw) continue;
    const lower = raw.toLowerCase();
    // 中文书写系统判断
    if (lower.startsWith("zh")) {
      const hant = /(tw|hk|mo|hant)/.test(lower);
      const wantLang = hant ? "zh-Hant" : "zh-Hans";
      const hit = LOCALES.find((l) => l.languageCode === wantLang);
      if (hit) return hit;
    }
    const primary = lower.split("-")[0];
    const map: Record<string, string> = {
      en: "en",
      ja: "ja",
      ko: "ko",
      de: "de",
      fr: "fr",
      es: "es",
      it: "it",
      ru: "ru",
      pt: "pt-BR",
    };
    const wantLang = map[primary];
    if (wantLang) {
      // 优先精确国家匹配
      const parts = lower.split("-");
      if (parts[1]) {
        const cc = parts[1].toUpperCase();
        const exact = LOCALES.find(
          (l) => l.languageCode === wantLang && l.countryCode === cc,
        );
        if (exact) return exact;
      }
      const hit = LOCALES.find((l) => l.languageCode === wantLang);
      if (hit) return hit;
    }
  }
  return findLocaleById(DEFAULT_LOCALE_ID)!;
}

// 解析初始 locale：localStorage(共用 key / 旧 key) → 浏览器语言 → 默认 en-US
export function resolveInitialLocale(): LocaleEntry {
  const savedId = localStorage.getItem(STORAGE_KEYS.locale);
  const byId = findLocaleById(savedId);
  if (byId) return byId;

  // 兼容旧 key（countryCode + languageCode）
  const cc =
    localStorage.getItem(STORAGE_KEYS.countryCode) ||
    localStorage.getItem("countryCode");
  const lc =
    localStorage.getItem(STORAGE_KEYS.languageCode) ||
    localStorage.getItem("languageCode");
  if (cc && lc) {
    const hit = LOCALES.find(
      (l) => l.countryCode === cc && l.languageCode === lc,
    );
    if (hit) return hit;
  }

  return detectFromBrowser();
}

export function persistLocale(locale: LocaleEntry) {
  localStorage.setItem(STORAGE_KEYS.locale, locale.id);
  localStorage.setItem(STORAGE_KEYS.countryCode, locale.countryCode);
  localStorage.setItem(STORAGE_KEYS.languageCode, locale.languageCode);
  // 兼容旧 key，保证与商城历史逻辑一致
  localStorage.setItem("countryCode", locale.countryCode);
  localStorage.setItem("languageCode", locale.languageCode);
}
