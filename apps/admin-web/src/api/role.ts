import request from '@/utils/request'
import type { IRoleListParams, ICreateOrUpdateRoleParams, IRoleItem } from '@/types/system/role'
import type { ICommonResponse, ICommonPageResponse } from '@/types/common'

/**
 * 获取角色列表分页
 */
export const rolePage = (params?: IRoleListParams) => {
  return request.get<ICommonPageResponse<IRoleItem[]>>('/admin/roles', { params })
}

/**
 * 创建角色
 */
export const createRole = (data: ICreateOrUpdateRoleParams) => {
  return request.post<ICommonResponse<unknown>>('/admin/roles', data)
}

/**
 * 根据ID获取角色详情
 */
export const roleInfo = (id: string) => {
  return request.get<ICommonResponse<IRoleItem>>(`/admin/roles/${id}`)
}

/**
 * 更新角色
 */
export const updateRole = (data: ICreateOrUpdateRoleParams) => {
  return request.put<ICommonResponse<unknown>>(`/admin/roles/${data.id}`, data)
}

/**
 * 删除角色
 */
export const deleteRole = (id: string) => {
  return request.delete<ICommonResponse<unknown>>(`/admin/roles/${id}`)
}

export const roleApi = {
  getRoles: (params: Record<string, unknown>) =>
    request.get('/admin/roles', { params }),
  getRoleDetail: (id: string) =>
    request.get('/admin/roles/' + id),
  createRole: (data: Record<string, unknown>) =>
    request.post('/admin/roles', data),
  updateRole: (id: string, data: Record<string, unknown>) =>
    request.put('/admin/roles/' + id, data),
  updateRoleStatus: (id: string, status: string) =>
    request.put('/admin/roles/' + id + '/status', { status }),
  deleteRole: (id: string) =>
    request.delete('/admin/roles/' + id),
  assignMenus: (id: string, menuIds: string[]) =>
    request.put('/admin/roles/' + id + '/menus', { menuIds }),
}
