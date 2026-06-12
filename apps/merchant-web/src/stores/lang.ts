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
import type { ILangCode, ILangOption } from '@/types/lang'

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

const langOptions: ILangOption[] = [
  {
    code: 'zhCN',
    locale: 'zh-CN',
    countryCode: 'CN',
    languageCode: 'zh-Hans',
    shortCode: 'CN',
    label: '简体中文',
    elementLocale: 'zhCN',
  },
  {
    code: 'zhTW',
    locale: 'zh-TW',
    countryCode: 'TW',
    languageCode: 'zh-Hant',
    shortCode: 'TW',
    label: '繁體中文',
    elementLocale: 'zhTW',
  },
  {
    code: 'enUS',
    locale: 'en-US',
    countryCode: 'US',
    languageCode: 'en',
    shortCode: 'US',
    label: 'English',
    elementLocale: 'EN',
  },
  {
    code: 'jaJP',
    locale: 'ja-JP',
    countryCode: 'JP',
    languageCode: 'ja',
    shortCode: 'JP',
    label: '日本語',
    elementLocale: 'ja',
  },
  {
    code: 'koKR',
    locale: 'ko-KR',
    countryCode: 'KR',
    languageCode: 'ko',
    shortCode: 'KR',
    label: '한국어',
    elementLocale: 'ko',
  },
]

const langOptionMap = Object.fromEntries(
  langOptions.map((option) => [option.code, option]),
) as Record<ILangCode, ILangOption>

function resolveLangCode(value: unknown): ILangCode {
  if (typeof value === 'string' && value in langOptionMap) return value as ILangCode
  if (APP_CONFIG.defaultLang in langOptionMap) return APP_CONFIG.defaultLang as ILangCode
  return 'enUS'
}

function extractMessages(payload: any): Record<string, string> {
  const data = payload?.data && typeof payload.data === 'object' ? payload.data : payload
  const source = data?.messages || data?.translations
  if (!source || typeof source !== 'object') return {}
  return Object.fromEntries(
    Object.entries(source).filter(([, value]) => typeof value === 'string' && value.length > 0),
  ) as Record<string, string>
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
  const currentLang = ref<ILangCode>(resolveLangCode(storage.get<ILangCode>(STORAGE_KEYS.LANG)))
  const currentCountryCode = ref<string>(
    storage.get<string>(STORAGE_KEYS.COUNTRY_CODE) || langOptionMap[currentLang.value].countryCode,
  )

  const currentLangOption = computed(
    () => langOptionMap[currentLang.value] || langOptionMap.enUS,
  )

  const elementLangMap = { EN, zhCN, zhTW, ja, ko } as const
  const currentElementLang = computed(
    () => elementLangMap[currentLangOption.value.elementLocale as keyof typeof elementLangMap] || EN,
  )

  const loadedMessages = ref<Record<string, string>>({})

  const loadMessages = async (countryCode?: string, langCode?: string) => {
    const lc = resolveLangCode(langCode || currentLang.value)
    const option = langOptionMap[lc]
    const cc = countryCode || currentCountryCode.value || option.countryCode
    try {
      const { data: res } = await request.get('/v1/public/translations', {
        params: {
          locale: option.locale,
          module: MERCHANT_NAMESPACES.join(','),
        },
      })
      if (res.code === 200) {
        const messages = normalizeRemoteMessages(extractMessages(res))
        loadedMessages.value = messages
        const { i18n } = await import('@/i18n')
        i18n.global.mergeLocaleMessage(lc, messages)
        currentCountryCode.value = cc
        storage.set(STORAGE_KEYS.COUNTRY_CODE, cc)
        storage.set(STORAGE_KEYS.LANGUAGE_CODE, option.languageCode)
      }
    } catch (e) {
      console.warn('Failed to load i18n messages:', e)
    }
  }

  const setLang = async (code: ILangCode) => {
    const next = resolveLangCode(code)
    const option = langOptionMap[next]
    currentLang.value = next
    currentCountryCode.value = option.countryCode
    storage.set(STORAGE_KEYS.LANG, next)
    storage.set(STORAGE_KEYS.COUNTRY_CODE, option.countryCode)
    storage.set(STORAGE_KEYS.LANGUAGE_CODE, option.languageCode)
    setI18nLang(next)
    await loadMessages(option.countryCode, next)
  }

  const setCountryCode = (code: string) => {
    currentCountryCode.value = code
    storage.set(STORAGE_KEYS.COUNTRY_CODE, code)
  }

  watch(currentLang, (newLang) => {
    const option = langOptionMap[newLang]
    storage.set(STORAGE_KEYS.LANG, newLang)
    storage.set(STORAGE_KEYS.LANGUAGE_CODE, option.languageCode)
    document.documentElement.lang = option.locale
  }, { immediate: true })

  watch(currentCountryCode, (newCode) => {
    storage.set(STORAGE_KEYS.COUNTRY_CODE, newCode)
  }, { immediate: true })

  return {
    currentLang, currentCountryCode, langOptions, currentLangOption,
    currentElementLang, loadedMessages, setLang, setCountryCode, loadMessages,
  }
})
