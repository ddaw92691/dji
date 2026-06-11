import request from '@/utils/request';
export const dashboardApi = {
    getOverview: () => request.get('/admin/dashboard'),
    getCharts: () => request.get('/admin/dashboard/charts'),
};
