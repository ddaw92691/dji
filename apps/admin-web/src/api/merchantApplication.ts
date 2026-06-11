import request from '@/utils/request'

export const merchantApplicationApi = {
  getApplications: (params: Record<string, unknown>) =>
    request.get('/admin/merchant-applications', { params }),
  getApplication: (id: string | number) =>
    request.get('/admin/merchant-applications/' + id),
  getByMerchant: (merchantId: string | number) =>
    request.get('/admin/merchant-applications/by-merchant/' + merchantId),
  getPendingCount: () =>
    request.get('/admin/merchant-applications/pending-count'),
  // 鉴权下载敏感证件（图片/视频），返回 blob
  getFile: (id: string | number, field: string) =>
    request.get<Blob>('/admin/merchant-applications/' + id + '/file/' + field, { responseType: 'blob' }),
  downloadFile: (accessUrl: string) =>
    request.get<Blob>(accessUrl, { responseType: 'blob' }),
  approveApplication: (id: string | number, data: Record<string, unknown>) =>
    request.post('/admin/merchant-applications/' + id + '/approve', data),
  rejectApplication: (id: string | number, data: Record<string, unknown>) =>
    request.post('/admin/merchant-applications/' + id + '/reject', data),
}
