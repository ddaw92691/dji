import { defineStore } from 'pinia'
import zhCN from 'element-plus/es/locale/lang/zh-cn'
import EN from 'element-plus/es/locale/lang/en'
import { setI18nLang } from '@/i18n'
import { APP_CONFIG } from '@/config/app.config'
import { STORAGE_KEYS, storage } from '@/utils/storage'
import request from '@/utils/request'
import type { ILangCode, ILangOption } from '@/types/lang'

export const useLangStore = defineStore('lang', () => {
  const currentLang = ref<ILangCode>(
    storage.get<ILangCode>(STORAGE_KEYS.LANG) || APP_CONFIG.defaultLang,
  )
  const currentCountryCode = ref<string>(
    storage.get<string>(STORAGE_KEYS.COUNTRY_CODE) || 'US',
  )

  const langOptions: ILangOption[] = [
    { code: 'enUS', shortCode: 'US', label: 'English', elementLocale: 'EN' },
    { code: 'jaJP', shortCode: 'JP', label: '日本語', elementLocale: 'zhCN' },
    { code: 'koKR', shortCode: 'KR', label: '한국어', elementLocale: 'zhCN' },
  ] as const

  const currentLangOption = computed(
    () => langOptions.find((option) => option.code === currentLang.value)!,
  )

  const elementLangMap = { EN, zhCN } as const
  const currentElementLang = computed(
    () => elementLangMap[currentLangOption.value.elementLocale as keyof typeof elementLangMap] || EN,
  )

  const loadedMessages = ref<Record<string, string>>({})

  const toApiLang = (code: string) => {
    if (code === 'jaJP') return 'ja'
    if (code === 'koKR') return 'ko'
    return 'en'
  }

  const loadMessages = async (countryCode?: string, langCode?: string) => {
    const cc = countryCode || currentCountryCode.value
    const lc = langCode || currentLang.value
    try {
      const { data: res } = await request.get('/public/i18n', {
        params: {
          countryCode: cc,
          languageCode: toApiLang(lc),
          namespaces: 'common,auth,admin,system,i18n,error,finance,product,order',
        },
      })
      if (res.code === 200 && res.data?.messages) {
        loadedMessages.value = res.data.messages
        // Merge into vue-i18n
        const { i18n } = await import('@/i18n')
        i18n.global.mergeLocaleMessage(lc === 'jaJP' ? 'ja' : lc === 'koKR' ? 'ko' : 'en', res.data.messages)
      }
    } catch (e) {
      console.warn('Failed to load i18n messages:', e)
    }
  }

  const setLang = async (code: ILangCode) => {
    currentLang.value = code
    setI18nLang(code)
    await loadMessages(undefined, code)
    window.location.reload()
  }

  const setCountryCode = (code: string) => {
    currentCountryCode.value = code
    storage.set(STORAGE_KEYS.COUNTRY_CODE, code)
  }

  watch(currentLang, (newLang) => {
    storage.set(STORAGE_KEYS.LANG, newLang)
  }, { immediate: true })

  watch(currentCountryCode, (newCode) => {
    storage.set(STORAGE_KEYS.COUNTRY_CODE, newCode)
  }, { immediate: true })

  return {
    currentLang, currentCountryCode, langOptions, currentLangOption,
    currentElementLang, loadedMessages, setLang, setCountryCode, loadMessages,
  }
})
