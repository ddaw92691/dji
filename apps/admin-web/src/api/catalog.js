import request from '@/utils/request';
export const catalogApi = {
    getProducts: (params) => request.get('/admin/catalog/products', { params }),
    getProduct: (id) => request.get(`/admin/catalog/products/${id}`),
    createProduct: (data) => request.post('/admin/catalog/products', data),
    updateProduct: (id, data) => request.put(`/admin/catalog/products/${id}`, data),
    updateProductStatus: (id, status) => request.put(`/admin/catalog/products/${id}/status`, { status }),
    deleteProduct: (id) => request.delete(`/admin/catalog/products/${id}`),
    getListings: (params) => request.get('/admin/catalog/listings', { params }),
    disableListing: (id) => request.put(`/admin/catalog/listings/${id}/disable`, { status: 'OFF_SALE' }),
};
