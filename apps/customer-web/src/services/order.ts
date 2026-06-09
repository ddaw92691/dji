import request from './request'

export interface OrderItem {
  id: number; productId: number; productTitle: string; productImage: string
  price: number; quantity: number; totalAmount: number
}

export interface OrderInfo {
  id: number; orderNo: string; totalAmount: number; payAmount: number; discountAmount: number
  merchantId?: number
  couponAmount: number; shippingAmount: number; currency: string; status: string; payStatus: string
  refundStatus: string; refundAmount: number; refundReason: string; refundRejectReason: string
  addressSnapshot: any; remark: string
  logisticsCompany: string; trackingNo: string
  paidAt: string; shippedAt: string; completedAt: string; cancelledAt: string
  createdAt: string; items: OrderItem[]; payment: any
}

export const orderApi = {
  createOrder: (data: any) => request.post<{code:number;data:{orders:OrderInfo[]}}>('/customer/orders', data),
  getOrders: (params?: any) => request.get<{code:number;data:{list:OrderInfo[];total:number}}>('/customer/orders', { params }),
  getOrderDetail: (id: number) => request.get<{code:number;data:OrderInfo}>('/customer/orders/' + id),
  cancelOrder: (id: number) => request.post<{code:number;data:any}>('/customer/orders/' + id + '/cancel'),
  payOrder: (id: number, method?: string) => request.post<{code:number;data:any}>('/customer/orders/' + id + '/pay', { method: method || 'MOCK' }),
  confirmOrder: (id: number) => request.post<{code:number;data:any}>('/customer/orders/' + id + '/confirm'),
}
