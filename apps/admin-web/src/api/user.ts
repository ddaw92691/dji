import request from '@/utils/request'
import type {
  IUserListParams,
  ICreateOrUpdateUserParams,
  IUpdateUserProfileParams,
  IUpdatePasswordParams,
  IUpdateUserAvatarParams,
  IUserItem,
} from '@/types/system/user'
import type { ICommonResponse, ICommonPageResponse } from '@/types/common'

/**
 * 获取用户列表分页
 */
export const userPage = (params?: IUserListParams) => {
  return request.get<ICommonPageResponse<IUserItem[]>>('/admin/users', { params })
}

/**
 * 创建用户
 */
export const createUser = (data: ICreateOrUpdateUserParams) => {
  return request.post<ICommonResponse<unknown>>('/admin/users', data)
}

/**
 * 根据ID获取用户详情
 */
export const userInfo = (id: string) => {
  return request.get<ICommonResponse<IUserItem>>(`/admin/users/${id}`)
}

/**
 * 更新用户
 */
export const updateUser = (data: ICreateOrUpdateUserParams) => {
  return request.put<ICommonResponse<unknown>>(`/admin/users/${data.id}`, data)
}

/**
 * 删除用户（支持批量）
 */
export const deleteUser = (ids: string[]) => {
  return request.delete<ICommonResponse<unknown>>('/admin/users', { data: ids })
}

/**
 * 修改当前登录用户个人信息
 */
export const updateProfile = (data: IUpdateUserProfileParams) => {
  return request.put<ICommonResponse<unknown>>('/admin/users/profile', data)
}

/**
 * 修改当前登录用户密码
 */
export const updatePasswordRequest = (data: IUpdatePasswordParams) => {
  return request.put<ICommonResponse<unknown>>('/admin/users/password', data)
}

/**
 * 修改当前登录用户头像
 */
export const updateAvatarRequest = (data: IUpdateUserAvatarParams) => {
  return request.put<ICommonResponse<unknown>>('/admin/users/avatar', data)
}
