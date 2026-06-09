import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'

export interface IMerchantOrder {
  id: number; orderNo: string; userId: number; userName: string
  totalAmount: number; payAmount: number; status: string; payStatus: string
  logisticsCompany: string; trackingNo: string
  paidAt: string; shippedAt: string; createdAt: string
  items: { productId: number; productTitle: string; productImage: string; price: number; quantity: number }[]
  addressSnapshot: any; remark: string
}

export const orderApi = {
  getOrders: (params: any) => request.get<ICommonResponse<{list:IMerchantOrder[];total:number}>>('/merchant/orders', { params }),
  getOrderDetail: (id: number) => request.get<ICommonResponse<IMerchantOrder>>('/merchant/orders/' + id),
  shipOrder: (id: number, data: {logisticsCompany: string; trackingNo: string}) => request.post<ICommonResponse<any>>('/merchant/orders/' + id + '/ship', data),
}
