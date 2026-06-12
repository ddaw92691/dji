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

const loggedKeys = new Set<string>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isI18nDebugEnabled() {
  try {
    return (
      import.meta.env.DEV || localStorage.getItem("i18n_debug") === "1"
    );
  } catch {
    return false;
  }
}

function debugI18n(event: string, detail: Record<string, unknown>) {
  if (!isI18nDebugEnabled()) return;
  console.info(`[i18n:customer] ${event}`, detail);
}

function normalizeLocaleEntry(raw: unknown): LocaleEntry | null {
  if (!isRecord(raw)) return null;
  const id = typeof raw.id === "string" ? raw.id : raw.locale;
  const countryCode = raw.countryCode;
  const languageCode = raw.languageCode;
  if (
    typeof id !== "string" ||
    typeof countryCode !== "string" ||
    typeof languageCode !== "string"
  ) {
    return null;
  }
  return {
    id,
    country: String(raw.country ?? raw.countryName ?? countryCode),
    language: String(raw.language ?? raw.nativeName ?? languageCode),
    countryCode,
    languageCode,
    region: String(raw.region ?? "Other Countries and Regions"),
  };
}

function normalizeLocaleList(list: unknown): LocaleEntry[] {
  if (!Array.isArray(list)) return [];
  return list
    .map(normalizeLocaleEntry)
    .filter((item): item is LocaleEntry => Boolean(item));
}

function extractMessages(payload: unknown): Dict {
  const data = isRecord(payload) && isRecord(payload.data) ? payload.data : payload;
  if (!isRecord(data)) return {};

  const source = data.translations ?? data.messages;
  if (!isRecord(source)) return {};

  const messages: Dict = {};
  Object.entries(source).forEach(([key, value]) => {
    if (typeof value === "string" && value.length > 0) {
      messages[key] = value;
    }
  });

  return messages;
}

interface I18nState {
  localeId: string;
  countryCode: string;
  languageCode: string;
  countries: CountryInfo[];
  locales: LocaleEntry[];
  regions: readonly string[];
  messages: Dict;
  loaded: boolean;
  loading: boolean;
  setLocale: (countryCode: string, languageCode: string) => Promise<void>;
  setLocaleById: (id: string) => Promise<void>;
  loadCountries: () => Promise<void>;
  t: (key: string, fallback?: string) => string;
}

const initial = resolveInitialLocale();
persistLocale(initial);

function findRuntimeLocaleById(
  id: string | undefined,
  locales: LocaleEntry[],
) {
  if (!id) return undefined;
  return locales.find((l) => l.id === id) || findLocaleById(id);
}

async function fetchMessages(l: LocaleEntry): Promise<Dict> {
  try {
    const res = await publicApi.getTranslations(l.id, NAMESPACES);
    const messages = res.data.code === 200 ? extractMessages(res.data) : {};
    debugI18n("remote messages loaded", {
      selectedLocale: l.id,
      savedLocale: localStorage.getItem("mall_locale"),
      messageKeyCount: Object.keys(messages).length,
      responseDataKeys: isRecord(res.data.data) ? Object.keys(res.data.data) : [],
    });
    return messages;
  } catch {
    try {
      const fallback = await publicApi.getI18n(
        l.countryCode,
        l.languageCode,
        NAMESPACES,
      );
      const messages =
        fallback.data.code === 200 ? extractMessages(fallback.data) : {};
      debugI18n("legacy messages loaded", {
        selectedLocale: l.id,
        messageKeyCount: Object.keys(messages).length,
      });
      return messages;
    } catch {
      return {};
    }
  }
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
      get().locales.find(
        (l) => l.countryCode === countryCode && l.languageCode === languageCode,
      ) ||
      LOCALES.find(
        (l) => l.countryCode === countryCode && l.languageCode === languageCode,
      ) ||
      get().locales.find((l) => l.languageCode === languageCode);
    const locale: LocaleEntry = match || {
      ...initial,
      countryCode,
      languageCode,
    };
    persistLocale(locale);
    debugI18n("locale changed", {
      selectedLocale: locale.id,
      savedLocale: localStorage.getItem("mall_locale"),
      savedCountryCode: localStorage.getItem("mall_countryCode"),
      savedLanguageCode: localStorage.getItem("mall_languageCode"),
    });
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
    const locale = findRuntimeLocaleById(id, get().locales);
    if (!locale) {
      debugI18n("locale ignored", { selectedLocale: id, reason: "not found" });
      return;
    }
    persistLocale(locale);
    debugI18n("locale changed", {
      selectedLocale: locale.id,
      savedLocale: localStorage.getItem("mall_locale"),
      savedCountryCode: localStorage.getItem("mall_countryCode"),
      savedLanguageCode: localStorage.getItem("mall_languageCode"),
    });
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
      const nextLocales = normalizeLocaleList(langRes.data.data?.list);
      if (langRes.data.code === 200 && nextLocales.length) {
        set({
          locales: nextLocales,
          regions: langRes.data.data.regions || REGION_ORDER,
        });
        debugI18n("languages loaded", {
          localeCount: nextLocales.length,
          regionCount: langRes.data.data.regions?.length || 0,
        });
      }
    } catch {
      set({ locales: LOCALES, regions: REGION_ORDER });
    }
    try {
      const res = await publicApi.getCountries();
      if (res.data.code === 200) set({ countries: res.data.data });
    } catch {
      /* Keep local locale catalog when country metadata is unavailable. */
    }
  },

  t: (key: string, fallback?: string) => {
    const { languageCode, localeId, messages } = get();
    if (
      isI18nDebugEnabled() &&
      !loggedKeys.has(key) &&
      loggedKeys.size < 80
    ) {
      loggedKeys.add(key);
      debugI18n("t key used", {
        key,
        locale: localeId,
        hasRemoteValue: Object.prototype.hasOwnProperty.call(messages, key),
        hasLocalValue: Object.prototype.hasOwnProperty.call(
          LOCAL_PACKS[languageCode] || {},
          key,
        ),
      });
    }
    const remote = messages[key];
    if (remote != null) return remote;
    const local = LOCAL_PACKS[languageCode]?.[key];
    if (local != null) return local;
    const enVal = LOCAL_PACKS.en?.[key];
    if (enVal != null) return enVal;
    return fallback ?? key;
  },
}));
