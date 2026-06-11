import request from '@/utils/request';
/**
 * 获取角色列表分页
 */
export const rolePage = (params) => {
    return request.get('/admin/roles', { params });
};
/**
 * 创建角色
 */
export const createRole = (data) => {
    return request.post('/admin/roles', data);
};
/**
 * 根据ID获取角色详情
 */
export const roleInfo = (id) => {
    return request.get(`/admin/roles/${id}`);
};
/**
 * 更新角色
 */
export const updateRole = (data) => {
    return request.put(`/admin/roles/${data.id}`, data);
};
/**
 * 删除角色
 */
export const deleteRole = (id) => {
    return request.delete(`/admin/roles/${id}`);
};
export const roleApi = {
    getRoles: (params) => request.get('/admin/roles', { params }),
    getRoleDetail: (id) => request.get('/admin/roles/' + id),
    createRole: (data) => request.post('/admin/roles', data),
    updateRole: (id, data) => request.put('/admin/roles/' + id, data),
    updateRoleStatus: (id, status) => request.put('/admin/roles/' + id + '/status', { status }),
    deleteRole: (id) => request.delete('/admin/roles/' + id),
    getRoleMenus: (id) => request.get('/admin/roles/' + id + '/menus'),
    assignMenus: (id, menuIds) => request.put('/admin/roles/' + id + '/menus', { menuIds }),
};
