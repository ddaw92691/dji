export function getMallUrl(path = '') {
  const baseUrl = (import.meta.env.VITE_MALL_URL || '').replace(/\/+$/, '')

  if (!path) return baseUrl || '/'

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath
}
