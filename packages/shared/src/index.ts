export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

export interface UserInfo {
  id: string
  email: string
  phone: string
  role: string
  nickname: string
  avatar: string
  countryCode: string
  languageCode: string
}

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MERCHANT' | 'AGENT' | 'CUSTOMER'

export interface MenuItem {
  id: string
  type: 'directory' | 'menu'
  path: string
  title: string
  icon: string
  parentId: string | null
  order: number
  status: string
  permission: string
  children: MenuItem[]
}

export interface PermissionsData {
  menus: MenuItem[]
  buttonPermissions: string[]
}
