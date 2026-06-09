import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'
import type { IMenuParams, IMenuItem, ICreateOrUpdateMenuParams } from '@/types/system/menu'

/**
 * 获取菜单列表（树形结构）
 */
export const menuPage = (params?: IMenuParams) => {
  return request.get<ICommonResponse<IMenuItem[]>>('/menus', { params })
}

/**
 * 根据ID获取菜单详情
 */
export const menuInfo = (id: string) => {
  return request.get<ICommonResponse<IMenuItem>>(`/menus/${id}`)
}

/**
 * 创建菜单
 */
export const createMenu = (data: ICreateOrUpdateMenuParams) => {
  return request.post<ICommonResponse<unknown>>('/menus', data)
}

/**
 * 更新菜单
 */
export const updateMenu = (data: ICreateOrUpdateMenuParams) => {
  return request.put<ICommonResponse<unknown>>('/menus', data)
}

/**
 * 删除菜单
 */
export const deleteMenu = (id: string) => {
  return request.delete<ICommonResponse<unknown>>(`/menus/${id}`)
}

export const menuApi = {
  getMenus: (params: Record<string, unknown>) =>
    request.get('/admin/menus', { params }),
  getMenuDetail: (id: string) =>
    request.get('/admin/menus/' + id),
  createMenu: (data: Record<string, unknown>) =>
    request.post('/admin/menus', data),
  updateMenu: (id: string, data: Record<string, unknown>) =>
    request.put('/admin/menus/' + id, data),
  deleteMenu: (id: string) =>
    request.delete('/admin/menus/' + id),
}
