import request from '@/utils/request';
export const orderApi = {
    getOrders: (params) => request.get('/admin/orders', { params }),
    getOrderDetail: (id) => request.get('/admin/orders/' + id),
    updateOrderStatus: (id, data) => request.put('/admin/orders/' + id + '/status', data),
    settleMerchant: (id) => request.post('/admin/orders/' + id + '/settle-merchant', {}),
    setEstimatedArrival: (id, data) => request.post('/admin/orders/' + id + '/set-estimated-arrival', data),
    markArrived: (id) => request.post('/admin/orders/' + id + '/mark-arrived', {}),
    settle: (id, data) => request.post('/admin/orders/' + id + '/settle', data || {}),
    getSettlementRecords: (id) => request.get('/admin/orders/' + id + '/settlement-records'),
};
