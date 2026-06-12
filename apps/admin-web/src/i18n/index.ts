import { createI18n } from 'vue-i18n'
import zhCN from '@/i18n/zh-CN.json'
import { APP_CONFIG } from '@/config/app.config'

// 总后台仅简体中文：所有语言槽位均指向 zhCN，保证任何历史选择都显示中文
export const messages = {
  zhCN,
  zhTW: zhCN,
  enUS: zhCN,
  jaJP: zhCN,
  koKR: zhCN,
}

export const i18n = createI18n({
  legacy: false,
  locale: APP_CONFIG.defaultLang || 'zhCN',
  fallbackLocale: 'zhCN',
  messages: messages as any,
  missing: (locale: string, key: string) => key,
})

export const setI18nLang = (lang: string) => {
  i18n.global.locale.value = lang as any
  document.documentElement.lang = lang
}
