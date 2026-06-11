import request from '@/utils/request';
export const productApi = {
    getProducts: (params) => request.get('/admin/products', { params }),
    getProductDetail: (id) => request.get(`/admin/products/${id}`),
    updateProductStatus: (id, status) => request.put(`/admin/products/${id}/status`, { status }),
    getAuditList: (params) => request.get('/admin/products/audit', { params }),
    auditProduct: (id, data) => request.put(`/admin/products/${id}/audit`, data),
};
