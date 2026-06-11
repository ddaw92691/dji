import { create } from "zustand";
import { publicApi, type CountryInfo } from "../services/public";
import {
  LOCALES,
  NAMESPACES,
  REGION_ORDER,
  findLocaleById,
  persistLocale,
  resolveInitialLocale,
  type LocaleEntry,
} from "../i18n/config";

import en from "../i18n/locales/en.json";
import zhHans from "../i18n/locales/zh-Hans.json";
import zhHant from "../i18n/locales/zh-Hant.json";
import ja from "../i18n/locales/ja.json";
import ko from "../i18n/locales/ko.json";
import de from "../i18n/locales/de.json";
import fr from "../i18n/locales/fr.json";
import es from "../i18n/locales/es.json";
import it from "../i18n/locales/it.json";
import ru from "../i18n/locales/ru.json";
import ptBR from "../i18n/locales/pt-BR.json";

type Dict = Record<string, string>;

const LOCAL_PACKS: Record<string, Dict> = {
  en,
  "zh-Hans": zhHans,
  "zh-Hant": zhHant,
  ja,
  ko,
  de,
  fr,
  es,
  it,
  ru,
  "pt-BR": ptBR,
};

interface I18nState {
  localeId: string;
  countryCode: string;
  languageCode: string;
  countries: CountryInfo[];
  locales: LocaleEntry[];
  regions: readonly string[];
  messages: Dict; // 后台翻译
  loaded: boolean;
  loading: boolean;
  // 兼容旧调用签名：setLocale(countryCode, languageCode)
  setLocale: (countryCode: string, languageCode: string) => Promise<void>;
  setLocaleById: (id: string) => Promise<void>;
  loadCountries: () => Promise<void>;
  t: (key: string, fallback?: string) => string;
}

const initial = resolveInitialLocale();
// 确保首屏即写入共用 + 旧 key，保持与官网同步
persistLocale(initial);

async function fetchMessages(l: LocaleEntry): Promise<Dict> {
  try {
    const res = await publicApi.getTranslations(l.id, NAMESPACES);
    if (res.data.code === 200) return (res.data.data.messages as Dict) || {};
  } catch {
    try {
      const fallback = await publicApi.getI18n(
        l.countryCode,
        l.languageCode,
        NAMESPACES,
      );
      if (fallback.data.code === 200)
        return (fallback.data.data.messages as Dict) || {};
    } catch {
      /* 接口失败 → 仅用本地兜底，不白屏 */
    }
  }
  return {};
}

export const useI18nStore = create<I18nState>((set, get) => ({
  localeId: initial.id,
  countryCode: initial.countryCode,
  languageCode: initial.languageCode,
  countries: [],
  locales: LOCALES,
  regions: REGION_ORDER,
  messages: {},
  loaded: false,
  loading: false,

  setLocale: async (countryCode: string, languageCode: string) => {
    const match =
      LOCALES.find(
        (l) => l.countryCode === countryCode && l.languageCode === languageCode,
      ) || get().locales.find((l) => l.languageCode === languageCode);
    const locale: LocaleEntry = match || {
      ...initial,
      countryCode,
      languageCode,
    };
    persistLocale(locale);
    set({
      localeId: locale.id,
      countryCode: locale.countryCode,
      languageCode: locale.languageCode,
      loading: true,
    });
    const messages = await fetchMessages(locale);
    set({ messages, loaded: true, loading: false });
  },

  setLocaleById: async (id: string) => {
    const locale = findLocaleById(id);
    if (!locale) return;
    persistLocale(locale);
    set({
      localeId: locale.id,
      countryCode: locale.countryCode,
      languageCode: locale.languageCode,
      loading: true,
    });
    const messages = await fetchMessages(locale);
    set({ messages, loaded: true, loading: false });
  },

  loadCountries: async () => {
    try {
      const langRes = await publicApi.getLanguages();
      if (langRes.data.code === 200 && langRes.data.data?.list?.length) {
        set({
          locales: langRes.data.data.list,
          regions: langRes.data.data.regions || REGION_ORDER,
        });
      }
    } catch {
      /* 静默失败，使用本地 LOCALES 作为选择器数据源 */
    }
    try {
      const res = await publicApi.getCountries();
      if (res.data.code === 200) set({ countries: res.data.data });
    } catch {
      /* 静默失败，使用本地 LOCALES 作为选择器数据源 */
    }
  },

  // 合并优先级：后台翻译 > 本地语言包 > 英文兜底 > fallback/key
  t: (key: string, fallback?: string) => {
    const { languageCode, messages } = get();
    const remote = messages[key];
    if (remote != null) return remote;
    const local = LOCAL_PACKS[languageCode]?.[key];
    if (local != null) return local;
    const enVal = LOCAL_PACKS.en?.[key];
    if (enVal != null) return enVal;
    return fallback ?? key;
  },
}));
