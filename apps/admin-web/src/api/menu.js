import request from '@/utils/request';
/**
 * 获取菜单列表（树形结构）
 */
export const menuPage = (params) => {
    return request.get('/admin/menus', { params });
};
/**
 * 根据ID获取菜单详情
 */
export const menuInfo = (id) => {
    return request.get(`/admin/menus/${id}`);
};
/**
 * 创建菜单
 */
export const createMenu = (data) => {
    return request.post('/admin/menus', data);
};
/**
 * 更新菜单
 */
export const updateMenu = (data) => {
    return request.put(`/admin/menus/${data.id}`, data);
};
/**
 * 删除菜单
 */
export const deleteMenu = (id) => {
    return request.delete(`/admin/menus/${id}`);
};
export const menuApi = {
    getMenus: (params) => request.get('/admin/menus', { params }),
    getMenuDetail: (id) => request.get('/admin/menus/' + id),
    createMenu: (data) => request.post('/admin/menus', data),
    updateMenu: (id, data) => request.put('/admin/menus/' + id, data),
    deleteMenu: (id) => request.delete('/admin/menus/' + id),
};
