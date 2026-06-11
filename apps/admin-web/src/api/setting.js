import request from '@/utils/request';
export const settingApi = {
    getSettings: (params) => request.get('/admin/settings', { params }),
    updateSetting: (key, value, description) => request.put(`/admin/settings/${key}`, { value, description }),
    batchUpdateSettings: (settings) => request.put('/admin/settings', { settings }),
};
