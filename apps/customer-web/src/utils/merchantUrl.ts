const LOCAL_MERCHANT_WEB_URL = 'http://localhost:5174'

function inferMerchantWebUrl() {
  if (typeof window === 'undefined') return LOCAL_MERCHANT_WEB_URL

  const { protocol, hostname } = window.location
  if (hostname === 'localhost' || hostname === '127.0.0.1') return LOCAL_MERCHANT_WEB_URL
  if (hostname.startsWith('store.')) return `${protocol}//merchant.${hostname.slice('store.'.length)}`
  if (hostname.startsWith('customer.')) return `${protocol}//merchant.${hostname.slice('customer.'.length)}`

  return LOCAL_MERCHANT_WEB_URL
}

export function getMerchantLoginUrl() {
  const baseUrl = (import.meta.env.VITE_MERCHANT_WEB_URL || inferMerchantWebUrl()).trim().replace(/\/+$/, '')
  return baseUrl.endsWith('/login') ? baseUrl : `${baseUrl}/login`
}
