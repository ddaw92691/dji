import request from '@/utils/request';
export const categoryApi = {
    getCategories: (params) => request.get('/admin/categories', { params }),
    createCategory: (data) => request.post('/admin/categories', data),
    updateCategory: (id, data) => request.put(`/admin/categories/${id}`, data),
    updateCategoryStatus: (id, status) => request.put(`/admin/categories/${id}/status`, { status }),
    deleteCategory: (id) => request.delete(`/admin/categories/${id}`),
    saveTranslations: (categoryId, data) => request.put(`/admin/categories/${categoryId}/translations`, data),
};
