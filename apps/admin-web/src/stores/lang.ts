import { defineStore } from 'pinia'
import zhCN from 'element-plus/es/locale/lang/zh-cn'
import { setI18nLang } from '@/i18n'
import { STORAGE_KEYS, storage } from '@/utils/storage'
import request from '@/utils/request'
import type { ILangCode, ILangOption } from '@/types/lang'

export const useLangStore = defineStore('lang', () => {
  // 总后台仅简体中文：强制 zhCN，忽略历史 storage 残留值
  const currentLang = ref<ILangCode>('zhCN')
  const currentCountryCode = ref<string>(
    storage.get<string>(STORAGE_KEYS.COUNTRY_CODE) || 'CN',
  )

  const langOptions: ILangOption[] = [
    { code: 'zhCN', shortCode: 'CN', label: '简体中文', elementLocale: 'zhCN' },
  ] as const

  const currentLangOption = computed(
    () => langOptions.find((option) => option.code === currentLang.value) || langOptions[0],
  )

  const elementLangMap = { zhCN } as const
  const currentElementLang = computed(
    () => elementLangMap[currentLangOption.value?.elementLocale as keyof typeof elementLangMap] || zhCN,
  )

  const loadedMessages = ref<Record<string, string>>({})

  const toApiLang = (_code: string) => 'zh-Hans'

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
        i18n.global.mergeLocaleMessage('zhCN', res.data.messages)
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
