import request from '@/utils/request'

export const customerApi = {
  getCustomers: (params: Record<string, unknown>) =>
    request.get('/admin/customers', { params }),
  getCustomerDetail: (id: string | number) =>
    request.get('/admin/customers/' + id),
  updateCustomer: (id: string | number, data: Record<string, unknown>) =>
    request.put('/admin/customers/' + id, data),
  updateCustomerStatus: (id: string | number, status: number) =>
    request.put('/admin/customers/' + id + '/status', { status }),
}
