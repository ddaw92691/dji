// 国际化的类型

// 应用内部语言 code。历史值为 zhCN/enUS；接入总后台后也支持 en-US、zh-CN、pt-BR 等运行时 locale。
export type ILangCode = string
// Element Plus 语言包 key
export type IElementLocale = 'EN' | 'zhCN' | 'zhTW' | 'ja' | 'ko'

/**
 * 国际化下拉菜单
 * 语言列表优先来自总后台「国家管理 + 语言管理」，本地固定列表只作为接口失败时兜底。
 */
export interface ILangOption {
  code: ILangCode
  locale: string
  countryCode: string
  languageCode: string
  shortCode: string
  label: string
  elementLocale: IElementLocale
}
