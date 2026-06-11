import request from '@/utils/request';
export const merchantApplicationApi = {
    getApplications: (params) => request.get('/admin/merchant-applications', { params }),
    getApplication: (id) => request.get('/admin/merchant-applications/' + id),
    getByMerchant: (merchantId) => request.get('/admin/merchant-applications/by-merchant/' + merchantId),
    getPendingCount: () => request.get('/admin/merchant-applications/pending-count'),
    // 鉴权下载敏感证件（图片/视频），返回 blob
    getFile: (id, field) => request.get('/admin/merchant-applications/' + id + '/file/' + field, { responseType: 'blob' }),
    downloadFile: (accessUrl) => request.get(accessUrl, { responseType: 'blob' }),
    approveApplication: (id, data) => request.post('/admin/merchant-applications/' + id + '/approve', data),
    rejectApplication: (id, data) => request.post('/admin/merchant-applications/' + id + '/reject', data),
};
