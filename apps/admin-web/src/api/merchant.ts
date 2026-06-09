import request from '@/utils/request'

export const merchantApi = {
  getMerchants: (params: Record<string, unknown>) =>
    request.get('/admin/merchants', { params }),
  createMerchant: (data: Record<string, unknown>) =>
    request.post('/admin/merchants', data),
  updateMerchant: (id: string | number, data: Record<string, unknown>) =>
    request.put('/admin/merchants/' + id, data),
  updateMerchantStatus: (id: string | number, status: string) =>
    request.put('/admin/merchants/' + id + '/status', { status }),
}
