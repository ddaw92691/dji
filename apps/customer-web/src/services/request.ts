import axios from 'axios'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
})

service.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  const cc = localStorage.getItem('mall_countryCode') || localStorage.getItem('countryCode') || 'US'
  const lc = localStorage.getItem('mall_languageCode') || localStorage.getItem('languageCode') || 'en'
  config.headers['X-Country-Code'] = cc
  config.headers['X-Language-Code'] = lc
  config.headers['Accept-Language'] = lc
  return config
})

service.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default service
