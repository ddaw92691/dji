import { defineStore } from 'pinia'
import zhCN from 'element-plus/es/locale/lang/zh-cn'
import zhTW from 'element-plus/es/locale/lang/zh-tw'
import EN from 'element-plus/es/locale/lang/en'
import ja from 'element-plus/es/locale/lang/ja'
import ko from 'element-plus/es/locale/lang/ko'
import { setI18nLang } from '@/i18n'
import { APP_CONFIG } from '@/config/app.config'
import { STORAGE_KEYS, storage } from '@/utils/storage'
import request from '@/utils/request'
import type { ILangCode, ILangOption, IElementLocale } from '@/types/lang'

const MERCHANT_NAMESPACES = [
  'common',
  'auth',
  'merchant',
  'system',
  'i18n',
  'error',
  'finance',
  'product',
  'order',
  'menu',
  'user',
  'role',
  'layout',
  'login',
  'button',
  'message',
  'placeholder',
  'tag',
  'tooltip',
]

const DEFAULT_LANG_OPTION: ILangOption = {
  code: 'enUS',
  locale: 'en-US',
  countryCode: 'US',
  languageCode: 'en',
  shortCode: 'US',
  label: 'English',
  elementLocale: 'EN',
}

const FALLBACK_LANG_OPTIONS: ILangOption[] = [
  { code: 'zhCN', locale: 'zh-CN', countryCode: 'CN', languageCode: 'zh-Hans', shortCode: 'CN', label: '简体中文', elementLocale: 'zhCN' },
  { code: 'zhTW', locale: 'zh-TW', countryCode: 'TW', languageCode: 'zh-Hant', shortCode: 'TW', label: '繁體中文', elementLocale: 'zhTW' },
  DEFAULT_LANG_OPTION,
  { code: 'jaJP', locale: 'ja-JP', countryCode: 'JP', languageCode: 'ja', shortCode: 'JP', label: '日本語', elementLocale: 'ja' },
  { code: 'koKR', locale: 'ko-KR', countryCode: 'KR', languageCode: 'ko', shortCode: 'KR', label: '한국어', elementLocale: 'ko' },
]

const FALLBACK_OPTION = FALLBACK_LANG_OPTIONS.find((item) => item.code === APP_CONFIG.defaultLang) || FALLBACK_LANG_OPTIONS[2]

function elementLocaleOf(languageCode: string): IElementLocale {
  const lc = String(languageCode || '').toLowerCase()
  if (lc === 'zh-hans' || lc === 'zh-cn') return 'zhCN'
  if (lc === 'zh-hant' || lc === 'zh-tw' || lc === 'zh-hk') return 'zhTW'
  if (lc === 'ja' || lc.startsWith('ja-')) return 'ja'
  if (lc === 'ko' || lc.startsWith('ko-')) return 'ko'
  return 'EN'
}

function normalizeRemoteLocale(raw: any): ILangOption | null {
  if (!raw || typeof raw !== 'object') return null
  const locale = String(raw.id || raw.locale || '').trim()
  const countryCode = String(raw.countryCode || '').trim().toUpperCase()
  const languageCode = String(raw.languageCode || '').trim()
  if (!locale || !countryCode || !languageCode) return null
  return {
    code: locale,
    locale,
    countryCode,
    languageCode,
    shortCode: countryCode,
    label: `${raw.country || raw.countryName || countryCode} · ${raw.language || raw.nativeName || languageCode}`,
    elementLocale: elementLocaleOf(languageCode),
  }
}

function findOption(options: ILangOption[], value: unknown): ILangOption {
  if (typeof value === 'string') {
    return (
      options.find((item) => item.code === value || item.locale === value) ||
      FALLBACK_LANG_OPTIONS.find((item) => item.code === value || item.locale === value) ||
      options.find((item) => item.languageCode === value) ||
      FALLBACK_LANG_OPTIONS.find((item) => item.languageCode === value) ||
      FALLBACK_OPTION ||
      DEFAULT_LANG_OPTION
    )
  }
  return FALLBACK_OPTION || DEFAULT_LANG_OPTION
}

function extractMessages(payload: any): Record<string, string> {
  const data = payload?.data && typeof payload.data === 'object' ? payload.data : payload
  const source = data?.messages || data?.translations
  if (!source || typeof source !== 'object') return {}
  const messages: Record<string, string> = {}
  Object.entries(source).forEach(([key, value]) => {
    if (typeof value === 'string' && value.length > 0) messages[key] = value
  })
  return messages
}

function normalizeRemoteMessages(messages: Record<string, string>) {
  const normalized: Record<string, string> = { ...messages }
  Object.entries(messages).forEach(([key, value]) => {
    const dot = key.indexOf('.')
    if (dot <= 0) return
    const namespaceCode = key.slice(0, dot)
    const shortKey = key.slice(dot + 1)
    if (MERCHANT_NAMESPACES.includes(namespaceCode) && normalized[shortKey] == null) {
      normalized[shortKey] = value
    }
  })
  return normalized
}

export const useLangStore = defineStore('lang', () => {
  const langOptions = ref<ILangOption[]>(FALLBACK_LANG_OPTIONS)
  const languageLoaded = ref(false)
  const savedLocale = storage.get<string>(STORAGE_KEYS.LOCALE)
  const savedLang = storage.get<string>(STORAGE_KEYS.LANG)
  const initialOption = findOption(FALLBACK_LANG_OPTIONS, savedLocale || savedLang)

  const currentLang = ref<ILangCode>(initialOption.code)
  const currentCountryCode = ref<string>(
    storage.get<string>(STORAGE_KEYS.COUNTRY_CODE) || initialOption.countryCode,
  )

  const currentLangOption = computed(
    () => findOption(langOptions.value, currentLang.value),
  )

  const elementLangMap = { EN, zhCN, zhTW, ja, ko } as const
  const currentElementLang = computed(
    () => elementLangMap[currentLangOption.value.elementLocale as keyof typeof elementLangMap] || EN,
  )

  const loadedMessages = ref<Record<string, string>>({})

  const loadLanguages = async () => {
    try {
      const { data: res } = await request.get('/v1/public/languages', { params: { _t: Date.now() } })
      const list = Array.isArray(res?.data?.list) ? res.data.list : []
      const remoteOptions = list.map(normalizeRemoteLocale).filter(Boolean) as ILangOption[]
      if (res.code === 200 && remoteOptions.length) {
        langOptions.value = remoteOptions
        const saved = storage.get<string>(STORAGE_KEYS.LOCALE) || storage.get<string>(STORAGE_KEYS.LANG)
        const option = findOption(remoteOptions, saved || currentLang.value)
        currentLang.value = option.code
        currentCountryCode.value = storage.get<string>(STORAGE_KEYS.COUNTRY_CODE) || option.countryCode
      }
    } catch (e) {
      langOptions.value = FALLBACK_LANG_OPTIONS
      console.warn('Failed to load language options:', e)
    } finally {
      languageLoaded.value = true
    }
  }

  const loadMessages = async (countryCode?: string, langCode?: string) => {
    if (!languageLoaded.value) await loadLanguages()
    const option = findOption(langOptions.value, langCode || currentLang.value)
    const cc = countryCode || currentCountryCode.value || option.countryCode
    try {
      const { data: res } = await request.get('/v1/public/translations', {
        params: {
          locale: option.locale,
          module: MERCHANT_NAMESPACES.join(','),
          _t: Date.now(),
        },
      })
      if (res.code === 200) {
        const messages = normalizeRemoteMessages(extractMessages(res))
        loadedMessages.value = messages
        const { i18n } = await import('@/i18n')
        i18n.global.mergeLocaleMessage(option.code, messages)
        i18n.global.mergeLocaleMessage(option.locale, messages)
        currentLang.value = option.code
        currentCountryCode.value = cc
        storage.set(STORAGE_KEYS.LANG, option.code)
        localStorage.setItem(STORAGE_KEYS.LOCALE, option.locale)
        storage.set(STORAGE_KEYS.COUNTRY_CODE, cc)
        storage.set(STORAGE_KEYS.LANGUAGE_CODE, option.languageCode)
        setI18nLang(option.code)
      }
    } catch (e) {
      console.warn('Failed to load i18n messages:', e)
    }
  }

  const setLang = async (code: ILangCode) => {
    const option = findOption(langOptions.value, code)
    currentLang.value = option.code
    currentCountryCode.value = option.countryCode
    storage.set(STORAGE_KEYS.LANG, option.code)
    localStorage.setItem(STORAGE_KEYS.LOCALE, option.locale)
    storage.set(STORAGE_KEYS.COUNTRY_CODE, option.countryCode)
    storage.set(STORAGE_KEYS.LANGUAGE_CODE, option.languageCode)
    setI18nLang(option.code)
    await loadMessages(option.countryCode, option.code)
  }

  const setCountryCode = (code: string) => {
    currentCountryCode.value = code
    storage.set(STORAGE_KEYS.COUNTRY_CODE, code)
  }

  watch(currentLang, (newLang) => {
    const option = findOption(langOptions.value, newLang)
    storage.set(STORAGE_KEYS.LANG, option.code)
    localStorage.setItem(STORAGE_KEYS.LOCALE, option.locale)
    storage.set(STORAGE_KEYS.LANGUAGE_CODE, option.languageCode)
    document.documentElement.lang = option.locale
  }, { immediate: true })

  watch(currentCountryCode, (newCode) => {
    storage.set(STORAGE_KEYS.COUNTRY_CODE, newCode)
  }, { immediate: true })

  return {
    currentLang, currentCountryCode, langOptions, currentLangOption,
    currentElementLang, loadedMessages, languageLoaded, loadLanguages, setLang, setCountryCode, loadMessages,
  }
})
