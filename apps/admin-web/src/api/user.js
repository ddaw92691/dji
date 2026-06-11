import request from '@/utils/request';
/**
 * 获取用户列表分页
 */
export const userPage = (params) => {
    return request.get('/admin/users', { params });
};
/**
 * 创建用户
 */
export const createUser = (data) => {
    return request.post('/admin/users', data);
};
/**
 * 根据ID获取用户详情
 */
export const userInfo = (id) => {
    return request.get(`/admin/users/${id}`);
};
/**
 * 更新用户
 */
export const updateUser = (data) => {
    return request.put(`/admin/users/${data.id}`, data);
};
/**
 * 删除用户（支持批量）
 */
export const deleteUser = (ids) => {
    return request.delete('/admin/users', { data: ids });
};
/**
 * 修改当前登录用户个人信息
 */
export const updateProfile = (data) => {
    return request.put('/admin/users/profile', data);
};
/**
 * 修改当前登录用户密码
 */
export const updatePasswordRequest = (data) => {
    return request.put('/admin/users/password', data);
};
/**
 * 修改当前登录用户头像
 */
export const updateAvatarRequest = (data) => {
    return request.put('/admin/users/avatar', data);
};
