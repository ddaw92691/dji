import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import service from "../services/request";
import {
  LOCALES,
  NAMESPACES,
  REGION_ORDER,
  persistLocale,
  resolveInitialLocale,
  type LocaleEntry,
} from "./config";

import en from "./locales/en.json";
import zhHans from "./locales/zh-Hans.json";
import zhHant from "./locales/zh-Hant.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import it from "./locales/it.json";
import ru from "./locales/ru.json";
import ptBR from "./locales/pt-BR.json";

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
  console.info(`[i18n:official] ${event}`, detail);
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

interface I18nContextValue {
  locale: LocaleEntry;
  locales: LocaleEntry[];
  regions: readonly string[];
  loading: boolean;
  setLocale: (locale: LocaleEntry) => void;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleEntry>(() =>
    resolveInitialLocale(),
  );
  const [remoteMessages, setRemoteMessages] = useState<Dict>({});
  const [availableLocales, setAvailableLocales] =
    useState<LocaleEntry[]>(LOCALES);
  const [availableRegions, setAvailableRegions] =
    useState<readonly string[]>(REGION_ORDER);
  const [loading, setLoading] = useState(false);
  const reqIdRef = useRef(0);
  const loggedKeysRef = useRef<Set<string>>(new Set());

  const resolved = useMemo<Dict>(() => {
    const base = LOCAL_PACKS.en || {};
    const local = LOCAL_PACKS[locale.languageCode] || {};
    return { ...base, ...local, ...remoteMessages };
  }, [locale.languageCode, remoteMessages]);

  const loadRemote = useCallback(async (l: LocaleEntry) => {
    const myReq = ++reqIdRef.current;
    setLoading(true);
    try {
      let data: any;
      try {
        const res = await service.get("/v1/public/translations", {
          params: { locale: l.id, module: NAMESPACES, _t: Date.now() },
        });
        data = res.data;
      } catch {
        const fallback = await service.get("/public/i18n", {
          params: {
            countryCode: l.countryCode,
            languageCode: l.languageCode,
            namespaces: NAMESPACES,
            _t: Date.now(),
          },
        });
        data = fallback.data;
      }
      if (myReq !== reqIdRef.current) return;
      const messages = data?.code === 200 ? extractMessages(data) : {};
      debugI18n("remote messages loaded", {
        selectedLocale: l.id,
        savedLocale: localStorage.getItem("mall_locale"),
        messageKeyCount: Object.keys(messages).length,
        responseDataKeys: isRecord(data?.data) ? Object.keys(data.data) : [],
      });
      setRemoteMessages(messages);
    } catch {
      if (myReq === reqIdRef.current) setRemoteMessages({});
    } finally {
      if (myReq === reqIdRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    service
      .get("/v1/public/languages", { params: { _t: Date.now() } })
      .then((res) => {
        const data = res.data?.data;
        const nextLocales = normalizeLocaleList(data?.list);
        if (res.data?.code === 200 && nextLocales.length) {
          setAvailableLocales(nextLocales);
          if (Array.isArray(data.regions)) setAvailableRegions(data.regions);
          debugI18n("languages loaded", {
            localeCount: nextLocales.length,
            regionCount: Array.isArray(data.regions) ? data.regions.length : 0,
          });
        }
      })
      .catch(() => {
        setAvailableLocales(LOCALES);
        setAvailableRegions(REGION_ORDER);
      });
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale.id;
    loadRemote(locale);
  }, [locale, loadRemote]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "mall_locale" || !event.newValue) return;
      const next =
        availableLocales.find((item) => item.id === event.newValue) ||
        LOCALES.find((item) => item.id === event.newValue);
      if (next && next.id !== locale.id) setLocaleState(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [availableLocales, locale.id]);

  const setLocale = useCallback((next: LocaleEntry) => {
    persistLocale(next);
    debugI18n("locale changed", {
      selectedLocale: next.id,
      savedLocale: localStorage.getItem("mall_locale"),
      savedCountryCode: localStorage.getItem("mall_countryCode"),
      savedLanguageCode: localStorage.getItem("mall_languageCode"),
    });
    setLocaleState(next);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string) => {
      if (
        isI18nDebugEnabled() &&
        !loggedKeysRef.current.has(key) &&
        loggedKeysRef.current.size < 80
      ) {
        loggedKeysRef.current.add(key);
        debugI18n("t key used", {
          key,
          locale: locale.id,
          hasValue: Object.prototype.hasOwnProperty.call(resolved, key),
        });
      }
      return resolved[key] ?? fallback ?? key;
    },
    [locale.id, resolved],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      locales: availableLocales,
      regions: availableRegions,
      loading,
      setLocale,
      t,
    }),
    [availableLocales, availableRegions, locale, loading, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
