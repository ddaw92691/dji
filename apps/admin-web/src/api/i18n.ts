import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'

export interface I18nCountry {
  id: number; name: string; code: string; flagIcon: string; phoneCode: string
  defaultLanguageCode: string; currencyCode: string; currencySymbol: string
  timezone: string; region: string; exchangeRate: number; status: string; sort: number
  createdAt: string; updatedAt: string
}

export interface I18nLanguage {
  id: number; name: string; nativeName: string; code: string
  status: string; sort: number; createdAt: string; updatedAt: string
}

export interface I18nCountryLanguage {
  id: number; countryId: number; countryCode: string; countryName: string
  languages: { id: number; languageId: number; code: string; name: string; nativeName: string; isDefault: boolean }[]
}

export interface I18nNamespace {
  id: number; name: string; code: string; description: string
  status: string; sort: number; createdAt: string; updatedAt: string
}

export interface I18nTranslation {
  id: number; namespaceCode: string; translationKey: string
  languageCode: string; countryCode: string; textValue: string
  description: string; status: string; createdAt: string; updatedAt: string
}

export interface PageData<T> {
  list: T[]; total: number; page: number; pageSize: number
}

export const i18nApi = {
  getCountries: (params?: any) => request.get<ICommonResponse<PageData<I18nCountry>>>('/admin/i18n/countries', { params }),
  createCountry: (data: any) => request.post<ICommonResponse<I18nCountry>>('/admin/i18n/countries', data),
  updateCountry: (id: number, data: any) => request.put<ICommonResponse<I18nCountry>>(`/admin/i18n/countries/${id}`, data),
  updateCountryStatus: (id: number, status: string) => request.put<ICommonResponse<any>>(`/admin/i18n/countries/${id}/status`, { status }),
  deleteCountry: (id: number) => request.delete<ICommonResponse<any>>(`/admin/i18n/countries/${id}`),

  getLanguages: (params?: any) => request.get<ICommonResponse<PageData<I18nLanguage>>>('/admin/i18n/languages', { params }),
  createLanguage: (data: any) => request.post<ICommonResponse<I18nLanguage>>('/admin/i18n/languages', data),
  updateLanguage: (id: number, data: any) => request.put<ICommonResponse<I18nLanguage>>(`/admin/i18n/languages/${id}`, data),
  updateLanguageStatus: (id: number, status: string) => request.put<ICommonResponse<any>>(`/admin/i18n/languages/${id}/status`, { status }),
  deleteLanguage: (id: number) => request.delete<ICommonResponse<any>>(`/admin/i18n/languages/${id}`),

  getCountryLanguages: (params?: any) => request.get<ICommonResponse<I18nCountryLanguage[]>>('/admin/i18n/country-languages', { params }),
  bindCountryLanguage: (data: any) => request.post<ICommonResponse<any>>('/admin/i18n/country-languages', data),
  setDefaultCountryLanguage: (id: number) => request.put<ICommonResponse<any>>(`/admin/i18n/country-languages/${id}/default`),
  deleteCountryLanguage: (id: number) => request.delete<ICommonResponse<any>>(`/admin/i18n/country-languages/${id}`),

  getNamespaces: (params?: any) => request.get<ICommonResponse<PageData<I18nNamespace>>>('/admin/i18n/namespaces', { params }),
  createNamespace: (data: any) => request.post<ICommonResponse<I18nNamespace>>('/admin/i18n/namespaces', data),
  updateNamespace: (id: number, data: any) => request.put<ICommonResponse<I18nNamespace>>(`/admin/i18n/namespaces/${id}`, data),
  updateNamespaceStatus: (id: number, status: string) => request.put<ICommonResponse<any>>(`/admin/i18n/namespaces/${id}/status`, { status }),
  deleteNamespace: (id: number) => request.delete<ICommonResponse<any>>(`/admin/i18n/namespaces/${id}`),

  getTranslations: (params?: any) => request.get<ICommonResponse<PageData<I18nTranslation>>>('/admin/i18n/translations', { params }),
  createTranslation: (data: any) => request.post<ICommonResponse<I18nTranslation>>('/admin/i18n/translations', data),
  updateTranslation: (id: number, data: any) => request.put<ICommonResponse<I18nTranslation>>(`/admin/i18n/translations/${id}`, data),
  updateTranslationStatus: (id: number, status: string) => request.put<ICommonResponse<any>>(`/admin/i18n/translations/${id}/status`, { status }),
  deleteTranslation: (id: number) => request.delete<ICommonResponse<any>>(`/admin/i18n/translations/${id}`),
  importTranslations: (data: any) => request.post<ICommonResponse<any>>('/admin/i18n/translations/import', data),
  exportTranslations: (params: any) => request.get<ICommonResponse<any>>('/admin/i18n/translations/export', { params }),
}
