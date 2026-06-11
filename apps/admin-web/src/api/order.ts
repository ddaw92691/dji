import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'

export interface IAdminOrder {
  id: number; orderNo: string; userId: number; userName: string
  merchantId: number; merchantName: string
  totalAmount: number; payAmount: number; status: string; payStatus: string
  logisticsCompany: string; trackingNo: string
  paidAt: string; shippedAt: string; completedAt: string; createdAt: string
  items: any[]; addressSnapshot: any; remark: string; payment: any
  orderSource?: string
  goodsCost?: number
  merchantProfit?: number
  merchantPaidStatus?: string
  merchantPaidAt?: string
  expectedArrivalAt?: string
  arrivalStatus?: string
  arrivedAt?: string
  settlementAmount?: number
  settleStatus?: string
  settledAt?: string
}

export const orderApi = {
  getOrders: (params: any) => request.get<ICommonResponse<{list:IAdminOrder[];total:number}>>('/admin/orders', { params }),
  getOrderDetail: (id: number) => request.get<ICommonResponse<IAdminOrder>>('/admin/orders/' + id),
  updateOrderStatus: (id: number, data: {status: string; remark: string}) => request.put<ICommonResponse<any>>('/admin/orders/' + id + '/status', data),
  settleMerchant: (id: number) => request.post<ICommonResponse<any>>('/admin/orders/' + id + '/settle-merchant', {}),
  setEstimatedArrival: (id: number, data: { expectedArrivalAt: string }) =>
    request.post<ICommonResponse<any>>('/admin/orders/' + id + '/set-estimated-arrival', data),
  markArrived: (id: number) =>
    request.post<ICommonResponse<any>>('/admin/orders/' + id + '/mark-arrived', {}),
  settle: (id: number, data?: { remark?: string }) =>
    request.post<ICommonResponse<any>>('/admin/orders/' + id + '/settle', data || {}),
  getSettlementRecords: (id: number) =>
    request.get<ICommonResponse<any[]>>('/admin/orders/' + id + '/settlement-records'),
}
