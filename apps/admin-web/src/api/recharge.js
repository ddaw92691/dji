import request from '@/utils/request';
export const rechargeApi = {
    getRecharges: (params) => request.get('/admin/recharges', { params }),
    approveRecharge: (id) => request.post('/admin/recharges/' + id + '/approve', {}),
    rejectRecharge: (id, rejectReason) => request.post('/admin/recharges/' + id + '/reject', { rejectReason }),
};
