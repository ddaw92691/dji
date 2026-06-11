import request from '@/utils/request';
export const customerMerchantApi = {
    getSessions: (params) => request.get('/admin/support/customer-merchant-sessions', { params }),
    getSessionDetail: (id) => request.get('/admin/support/customer-merchant-sessions/' + id),
    getMessages: (id) => request.get('/admin/support/sessions/' + id + '/messages'),
    closeSession: (id, reason) => request.put('/admin/support/customer-merchant-sessions/' + id + '/close', { closeReason: reason || '' }),
    markRead: (id) => request.put('/admin/support/sessions/' + id + '/read'),
};
export const platformSupportApi = {
    getSessions: (params) => request.get('/admin/support/platform-sessions', { params }),
    getSessionDetail: (id) => request.get('/admin/support/platform-sessions/' + id),
    getMessages: (id) => request.get('/admin/support/sessions/' + id + '/messages'),
    sendMessage: (id, data) => request.post('/admin/support/platform-sessions/' + id + '/messages', data),
    closeSession: (id, reason) => request.put('/admin/support/platform-sessions/' + id + '/close', { closeReason: reason || '' }),
};
export const inspectionApi = {
    getList: (params) => request.get('/admin/support/inspection-sessions', { params }),
    create: (data) => request.post('/admin/support/inspection-sessions', data),
    getMessages: (sessionId) => request.get('/admin/support/sessions/' + sessionId + '/messages'),
    score: (id, data) => request.put('/admin/support/inspection-sessions/' + id + '/score', data),
};
export const quickReplyAdminApi = {
    getList: (params) => request.get('/admin/support/quick-replies', { params }),
    create: (data) => request.post('/admin/support/quick-replies', data),
    update: (id, data) => request.put('/admin/support/quick-replies/' + id, data),
    delete: (id) => request.delete('/admin/support/quick-replies/' + id),
};
