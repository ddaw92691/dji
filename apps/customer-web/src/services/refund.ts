import request from './request'
export const refundApi = { requestRefund: (orderId: number, reason: string) => request.post<{code:number;data:any}>('/customer/orders/' + orderId + '/refund', { reason }) }
