import request from '@/utils/request';
export const financeApi = {
    getOverview: () => request.get('/admin/finance/overview'),
    getWithdrawals: (params) => request.get('/admin/withdrawals', { params }),
    getWithdrawalDetail: (id) => request.get('/admin/withdrawals/' + id),
    approveWithdrawal: (id) => request.put('/admin/withdrawals/' + id + '/approve'),
    rejectWithdrawal: (id, rejectReason) => request.put('/admin/withdrawals/' + id + '/reject', { rejectReason }),
    getCommissions: (params) => request.get('/admin/commissions', { params }),
    getPayments: (params) => request.get('/admin/payments', { params }),
    getFundLogs: (params) => request.get('/admin/finance/fund-logs', { params }),
};
