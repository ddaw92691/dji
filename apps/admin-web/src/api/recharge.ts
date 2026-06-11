import request from '@/utils/request'

export const rechargeApi = {
  getRecharges: (params: Record<string, unknown>) =>
    request.get('/admin/recharges', { params }),
  approveRecharge: (id: string | number) =>
    request.post('/admin/recharges/' + id + '/approve', {}),
  rejectRecharge: (id: string | number, rejectReason: string) =>
    request.post('/admin/recharges/' + id + '/reject', { rejectReason }),
}
