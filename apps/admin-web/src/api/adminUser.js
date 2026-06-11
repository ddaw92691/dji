import request from '@/utils/request';
export const adminUserApi = {
    getAdminUsers: (params) => request.get('/admin/admin-users', { params }),
    createAdminUser: (data) => request.post('/admin/admin-users', data),
    updateAdminUser: (id, data) => request.put('/admin/admin-users/' + id, data),
    updateAdminUserStatus: (id, status) => request.put('/admin/admin-users/' + id + '/status', { status }),
    resetAdminUserPassword: (id, password) => request.put('/admin/admin-users/' + id + '/password', { password }),
    deleteAdminUser: (id) => request.delete('/admin/admin-users/' + id),
};
