import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import service from '../services/request'
import {
  LOCALES,
  NAMESPACES,
  REGION_ORDER,
  persistLocale,
  resolveInitialLocale,
  type LocaleEntry,
} from './config'

import en from './locales/en.json'
import zhHans from './locales/zh-Hans.json'
import zhHant from './locales/zh-Hant.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import de from './locales/de.json'
import fr from './locales/fr.json'
import es from './locales/es.json'
import it from './locales/it.json'
import ru from './locales/ru.json'
import ptBR from './locales/pt-BR.json'

type Dict = Record<string, string>

// 本地兜底语言包，按 languageCode 索引
const LOCAL_PACKS: Record<string, Dict> = {
  en, 'zh-Hans': zhHans, 'zh-Hant': zhHant, ja, ko, de, fr, es, it, ru, 'pt-BR': ptBR,
}

interface I18nContextValue {
  locale: LocaleEntry
  locales: LocaleEntry[]
  regions: readonly string[]
  loading: boolean
  setLocale: (locale: LocaleEntry) => void
  t: (key: string, fallback?: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleEntry>(() => resolveInitialLocale())
  const [remoteMessages, setRemoteMessages] = useState<Dict>({})
  const [loading, setLoading] = useState(false)
  const reqIdRef = useRef(0)

  // 合并优先级：后台翻译 > 本地语言包 > 英文兜底 > key
  const resolved = useMemo<Dict>(() => {
    const base = LOCAL_PACKS.en || {}
    const local = LOCAL_PACKS[locale.languageCode] || {}
    return { ...base, ...local, ...remoteMessages }
  }, [locale.languageCode, remoteMessages])

  const loadRemote = useCallback(async (l: LocaleEntry) => {
    const myReq = ++reqIdRef.current
    setLoading(true)
    try {
      // 带 locale 维度参数，刷新即拉取最新，避免长期旧缓存
      const { data } = await service.get('/public/i18n', {
        params: { countryCode: l.countryCode, languageCode: l.languageCode, namespaces: NAMESPACES, _t: Date.now() },
      })
      if (myReq !== reqIdRef.current) return // 已被更晚的切换覆盖
      if (data?.code === 200 && data.data?.messages) {
        setRemoteMessages(data.data.messages as Dict)
      } else {
        setRemoteMessages({})
      }
    } catch {
      // 接口失败 → 仅用本地兜底，不白屏
      if (myReq === reqIdRef.current) setRemoteMessages({})
    } finally {
      if (myReq === reqIdRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale.id
    loadRemote(locale)
  }, [locale, loadRemote])

  const setLocale = useCallback((next: LocaleEntry) => {
    persistLocale(next)
    setLocaleState(next)
  }, [])

  const t = useCallback(
    (key: string, fallback?: string) => resolved[key] ?? fallback ?? key,
    [resolved],
  )

  const value = useMemo<I18nContextValue>(
    () => ({ locale, locales: LOCALES, regions: REGION_ORDER, loading, setLocale, t }),
    [locale, loading, setLocale, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
