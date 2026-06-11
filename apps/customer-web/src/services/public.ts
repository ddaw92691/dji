import request from "./request";
import type { LocaleEntry } from "../i18n/config";

export interface CountryInfo {
  id: number;
  name: string;
  code: string;
  flagIcon: string;
  phoneCode: string;
  defaultLanguageCode: string;
  currencyCode: string;
  currencySymbol: string;
  timezone: string;
  languages: LanguageInfo[];
}

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  isDefault: boolean;
}

export interface I18nResponse {
  languageCode: string;
  countryCode: string;
  fallbackLanguageCode?: string;
  fallbackLocale?: string;
  locale?: string;
  messages: Record<string, string>;
}

export interface PublicLanguageResponse {
  defaultLocale: string;
  regions: string[];
  groups: Array<{ region: string; items: LocaleEntry[] }>;
  list: LocaleEntry[];
  updatedAt: number;
}

export const publicApi = {
  getCountries: () =>
    request.get<{ code: number; data: CountryInfo[] }>("/public/countries"),
  getCountryLanguages: (countryCode: string) =>
    request.get<{ code: number; data: LanguageInfo[] }>(
      `/public/countries/${countryCode}/languages`,
    ),
  getI18n: (countryCode: string, languageCode: string, namespaces: string) =>
    request.get<{ code: number; data: I18nResponse }>("/public/i18n", {
      params: { countryCode, languageCode, namespaces, _t: Date.now() },
    }),
  getLanguages: () =>
    request.get<{ code: number; data: PublicLanguageResponse }>(
      "/v1/public/languages",
      {
        params: { _t: Date.now() },
      },
    ),
  getTranslations: (locale: string, module: string) =>
    request.get<{ code: number; data: I18nResponse }>(
      "/v1/public/translations",
      {
        params: { locale, module, _t: Date.now() },
      },
    ),
};
