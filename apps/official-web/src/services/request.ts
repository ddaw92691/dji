import axios from 'axios'

const service = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

service.interceptors.request.use((config) => {
  const lang = localStorage.getItem('languageCode') || 'en'
  config.headers['X-Language-Code'] = lang
  config.headers['Accept-Language'] = lang
  return config
})

export default service
