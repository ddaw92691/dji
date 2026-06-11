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

// 本地兜底语言包，按 languageCode 索引
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

  // 合并优先级：后台翻译 > 本地语言包 > 英文兜底 > key
  const resolved = useMemo<Dict>(() => {
    const base = LOCAL_PACKS.en || {};
    const local = LOCAL_PACKS[locale.languageCode] || {};
    return { ...base, ...local, ...remoteMessages };
  }, [locale.languageCode, remoteMessages]);

  const loadRemote = useCallback(async (l: LocaleEntry) => {
    const myReq = ++reqIdRef.current;
    setLoading(true);
    try {
      // 优先读取总后台翻译管理（v1），失败后兼容旧接口。带时间戳避免 Safari / CDN 长缓存。
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
      if (myReq !== reqIdRef.current) return; // 已被更晚的切换覆盖
      if (data?.code === 200 && data.data?.messages) {
        setRemoteMessages(data.data.messages as Dict);
      } else {
        setRemoteMessages({});
      }
    } catch {
      // 接口失败 → 仅用本地兜底，不白屏
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
        if (res.data?.code === 200 && Array.isArray(data?.list)) {
          setAvailableLocales(data.list as LocaleEntry[]);
          if (Array.isArray(data.regions)) setAvailableRegions(data.regions);
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
    setLocaleState(next);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string) => resolved[key] ?? fallback ?? key,
    [resolved],
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
