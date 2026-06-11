import request from '@/utils/request';
export const auditLogApi = {
    getLogs: (params) => request.get('/admin/audit-logs', { params }),
};
