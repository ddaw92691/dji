import request from '@/utils/request';
export const taxApi = {
    getTaxNotices: (params) => request.get('/admin/tax/notices', { params }),
    createTaxNotice: (data) => request.post('/admin/tax/notices', data),
    updateTaxNotice: (id, data) => request.put(`/admin/tax/notices/${id}`, data),
    cancelTaxNotice: (id) => request.put(`/admin/tax/notices/${id}/cancel`),
    reviewTaxNotice: (id, data) => request.put(`/admin/tax/notices/${id}/review`, data),
};
