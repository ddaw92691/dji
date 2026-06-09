import { create } from 'zustand'
import { publicApi, type CountryInfo } from '../services/public'

interface I18nState {
  countryCode: string
  languageCode: string
  countries: CountryInfo[]
  messages: Record<string, string>
  loaded: boolean
  loading: boolean
  setLocale: (countryCode: string, languageCode: string) => Promise<void>
  loadCountries: () => Promise<void>
  t: (key: string) => string
}

function getInitialCountry() {
  return localStorage.getItem('countryCode') || 'JP'
}

function getInitialLang() {
  return localStorage.getItem('languageCode') || 'ja'
}

export const useI18nStore = create<I18nState>((set, get) => ({
  countryCode: getInitialCountry(),
  languageCode: getInitialLang(),
  countries: [],
  messages: {},
  loaded: false,
  loading: false,

  setLocale: async (countryCode: string, languageCode: string) => {
    set({ countryCode, languageCode, loading: true })
    localStorage.setItem('countryCode', countryCode)
    localStorage.setItem('languageCode', languageCode)

    try {
      const res = await publicApi.getI18n(
        countryCode,
        languageCode,
        'common,auth,customer,error',
      )
      if (res.data.code === 200) {
        set({ messages: res.data.data.messages, loaded: true, loading: false })
      }
    } catch {
      set({ loading: false })
    }
  },

  loadCountries: async () => {
    try {
      const res = await publicApi.getCountries()
      if (res.data.code === 200) {
        set({ countries: res.data.data })
      }
    } catch {
      // Silently fail - countries will be empty
    }
  },

  t: (key: string) => {
    return get().messages[key] || key
  },
}))
