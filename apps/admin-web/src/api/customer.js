import request from '@/utils/request';
export const customerApi = {
    getCustomers: (params) => request.get('/admin/customers', { params }),
    getCustomerDetail: (id) => request.get('/admin/customers/' + id),
    updateCustomer: (id, data) => request.put('/admin/customers/' + id, data),
    updateCustomerStatus: (id, status) => request.put('/admin/customers/' + id + '/status', { status }),
};
