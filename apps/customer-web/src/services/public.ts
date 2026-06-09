import request from './request'

export interface CountryInfo {
  id: number
  name: string
  code: string
  flagIcon: string
  phoneCode: string
  defaultLanguageCode: string
  currencyCode: string
  currencySymbol: string
  timezone: string
  languages: LanguageInfo[]
}

export interface LanguageInfo {
  code: string
  name: string
  nativeName: string
  isDefault: boolean
}

export interface I18nResponse {
  languageCode: string
  countryCode: string
  fallbackLanguageCode: string
  messages: Record<string, string>
}

export const publicApi = {
  getCountries: () => request.get<{ code: number; data: CountryInfo[] }>('/public/countries'),
  getCountryLanguages: (countryCode: string) =>
    request.get<{ code: number; data: LanguageInfo[] }>(`/public/countries/${countryCode}/languages`),
  getI18n: (countryCode: string, languageCode: string, namespaces: string) =>
    request.get<{ code: number; data: I18nResponse }>('/public/i18n', {
      params: { countryCode, languageCode, namespaces },
    }),
}
