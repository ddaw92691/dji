import request from '@/utils/request';
export const bannerApi = {
    getBanners: (params) => request.get('/admin/banners', { params }),
    createBanner: (data) => request.post('/admin/banners', data),
    updateBanner: (id, data) => request.put(`/admin/banners/${id}`, data),
    updateBannerStatus: (id, status) => request.put(`/admin/banners/${id}/status`, { status }),
    deleteBanner: (id) => request.delete(`/admin/banners/${id}`),
    saveTranslations: (bannerId, data) => request.put(`/admin/banners/${bannerId}/translations`, data),
};
