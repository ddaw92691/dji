import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { STORAGE_KEYS, storage } from '@/utils/storage'

type ApiResponse<T = any> = {
  code: number
  message?: string
  data: T
  [key: string]: any
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

const LEGACY_LANG_HEADERS: Record<string, { locale: string; countryCode: string; languageCode: string }> = {
  zhCN: { locale: 'zh-CN', countryCode: 'CN', languageCode: 'zh-Hans' },
  zhTW: { locale: 'zh-TW', countryCode: 'TW', languageCode: 'zh-Hant' },
  enUS: { locale: 'en-US', countryCode: 'US', languageCode: 'en' },
  jaJP: { locale: 'ja-JP', countryCode: 'JP', languageCode: 'ja' },
  koKR: { locale: 'ko-KR', countryCode: 'KR', languageCode: 'ko' },
}
const DEFAULT_LANG_HEADERS = { locale: 'en-US', countryCode: 'US', languageCode: 'en' }

function resolveLocaleHeaders() {
  const legacyLang = storage.get<string>(STORAGE_KEYS.LANG) || 'enUS'
  const legacy = LEGACY_LANG_HEADERS[legacyLang] || DEFAULT_LANG_HEADERS
  const locale = storage.get<string>(STORAGE_KEYS.LOCALE) || legacy.locale
  const countryCode = storage.get<string>(STORAGE_KEYS.COUNTRY_CODE) || legacy.countryCode
  const languageCode = storage.get<string>(STORAGE_KEYS.LANGUAGE_CODE) || legacy.languageCode
  return { locale, countryCode, languageCode }
}

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = storage.get<string>(STORAGE_KEYS.TOKEN)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    const localeHeaders = resolveLocaleHeaders()
    config.headers['Accept-Language'] = localeHeaders.locale
    config.headers['X-Locale'] = localeHeaders.locale
    config.headers['X-Country-Code'] = localeHeaders.countryCode
    config.headers['X-Language-Code'] = localeHeaders.languageCode

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message } = response.data

    if (code === 401) {
      ElMessage.error('登录已过期，请重新登录')
      storage.remove(STORAGE_KEYS.TOKEN)
      router.push('/login')
    } else if (code === 403) {
      ElMessage.error('没有权限访问')
    } else if (code === 500) {
      ElMessage.error(message || '服务器异常，请稍后重试')
    }

    return response
  },
  (error) => {
    let errorMessage = '请求失败'

    if (error.response) {
      const backendMsg = error.response.data?.message
      switch (error.response.status) {
        case 401:
          errorMessage = '登录已过期，请重新登录'
          storage.remove(STORAGE_KEYS.TOKEN)
          router.push('/login')
          break
        case 403:
          errorMessage = '没有权限访问'
          break
        case 404:
          errorMessage = '接口不存在'
          break
        case 500:
          errorMessage = backendMsg || '服务器异常，请稍后重试'
          break
        default:
          errorMessage = error.response.data?.message || `请求失败(${error.response.status})`
      }
    } else if (error.request) {
      errorMessage = '网络连接失败，请检查服务是否正常'
    } else {
      errorMessage = error.message || '请求失败'
    }

    ElMessage.error(errorMessage)
    return Promise.reject(error)
  },
)

// 请求方法对象
const request = {
  /**
   * GET 请求
   * @param url 请求地址
   * @param config 请求配置（可选）
   * @returns Promise<AxiosResponse>
   */
  get<T = ApiResponse>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return service.get<T>(url, config)
  },

  /**
   * POST 请求
   * @param url 请求地址
   * @param data 请求体数据（可选）
   * @param config 请求配置（可选）
   * @returns Promise<AxiosResponse>
   */
  post<T = ApiResponse>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return service.post<T>(url, data, config)
  },

  /**
   * PUT 请求
   * @param url 请求地址
   * @param data 请求体数据（可选）
   * @param config 请求配置（可选）
   * @returns Promise<AxiosResponse>
   */
  put<T = ApiResponse>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return service.put<T>(url, data, config)
  },

  /**
   * DELETE 请求
   * @param url 请求地址
   * @param config 请求配置（可选）
   * @returns Promise<AxiosResponse>
   */
  delete<T = ApiResponse>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return service.delete<T>(url, config)
  },
}

export default request
export { service }
