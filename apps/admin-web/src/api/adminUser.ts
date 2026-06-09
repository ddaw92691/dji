import request from '@/utils/request'

export const adminUserApi = {
  getAdminUsers: (params: Record<string, unknown>) =>
    request.get('/admin/admin-users', { params }),
  createAdminUser: (data: Record<string, unknown>) =>
    request.post('/admin/admin-users', data),
  updateAdminUser: (id: string | number, data: Record<string, unknown>) =>
    request.put('/admin/admin-users/' + id, data),
  updateAdminUserStatus: (id: string | number, status: number) =>
    request.put('/admin/admin-users/' + id + '/status', { status }),
  resetAdminUserPassword: (id: string | number, password: string) =>
    request.put('/admin/admin-users/' + id + '/password', { password }),
  deleteAdminUser: (id: string | number) =>
    request.delete('/admin/admin-users/' + id),
}
