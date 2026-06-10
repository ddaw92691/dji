// 权限指令

import type { Directive, DirectiveBinding } from 'vue'
import { storage, STORAGE_KEYS } from '@/utils/storage'

/**
 * 解析 JWT，判断当前登录用户是否为超级管理员。
 * 超级管理员拥有全部按钮权限，无需逐个匹配 buttonPermissions，
 * 也避免前端按钮的权限标识与后端返回值前缀不一致时被误禁用。
 */
const isSuperAdmin = (): boolean => {
  const token = storage.get<string>(STORAGE_KEYS.TOKEN)
  if (!token) return false
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return false
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    base64 += '='.repeat((4 - (base64.length % 4)) % 4)
    const payload = JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      ),
    )
    return payload?.role === 'SUPER_ADMIN'
  } catch {
    return false
  }
}

/**
 * 判断是否有权限
 * @param value 权限值
 */
const checkPermission = (value: string | string[]): boolean => {
  // 如果没有传入权限值，默认没有权限
  if (!value) return false

  // 超级管理员放行所有按钮
  if (isSuperAdmin()) return true

  const menuStore = useMenuStore()

  // 单个权限
  if (typeof value === 'string') {
    return menuStore.buttonPermissions.includes(value)
  }

  // 多个权限
  if (Array.isArray(value)) {
    return value.every((permission) => menuStore.buttonPermissions.includes(permission))
  }

  return false
}

// 权限指令
export const permissionDirective: Directive = {
  mounted(el: HTMLButtonElement, binding: DirectiveBinding<string | string[]>) {
    if (checkPermission(binding.value)) {
      el.disabled = false
      if (el.classList.contains('el-button')) el.classList.remove('is-disabled')
    } else {
      el.disabled = true
      if (el.classList.contains('el-button')) el.classList.add('is-disabled')
    }
  },
}
