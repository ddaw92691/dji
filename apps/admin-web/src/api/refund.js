import request from '@/utils/request';
export const refundApi = {
    getRefunds: (params) => request.get('/admin/refunds', { params }),
    getRefundDetail: (orderId) => request.get('/admin/refunds/' + orderId),
    approveRefund: (orderId) => request.put('/admin/refunds/' + orderId + '/approve'),
    rejectRefund: (orderId, rejectReason) => request.put('/admin/refunds/' + orderId + '/reject', { rejectReason }),
};
