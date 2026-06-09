import { createI18n } from 'vue-i18n'
import enUS from '@/i18n/en-US.json'
import { APP_CONFIG } from '@/config/app.config'
import { STORAGE_KEYS, storage } from '@/utils/storage'

export const messages = {
  zhCN: {},
  zhTW: {},
  enUS,
  jaJP: {},
  koKR: {},
}

export const i18n = createI18n({
  legacy: false,
  locale: storage.get('lang') || APP_CONFIG.defaultLang,
  fallbackLocale: 'enUS',
  messages: messages as any,
  missing: (locale: string, key: string) => key,
})

export const setI18nLang = (lang: string) => {
  i18n.global.locale.value = lang as any
  document.documentElement.lang = lang
}
