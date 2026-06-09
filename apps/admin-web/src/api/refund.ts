import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'

export interface IAdminRefund {
  id: number
  orderId: number
  orderNo: string
  userId: number
  userName: string
  merchantId: number
  merchantName: string
  payAmount: number
  refundAmount: number
  refundStatus: string
  refundReason: string
  rejectReason: string
  order: any
  items: any[]
  payment: any
  createdAt: string
  reviewedAt: string
}

export const refundApi = {
  getRefunds: (params: any) => request.get<ICommonResponse<{ list: IAdminRefund[]; total: number }>>('/admin/refunds', { params }),
  getRefundDetail: (orderId: number) => request.get<ICommonResponse<IAdminRefund>>('/admin/refunds/' + orderId),
  approveRefund: (orderId: number) => request.put<ICommonResponse<any>>('/admin/refunds/' + orderId + '/approve'),
  rejectRefund: (orderId: number, rejectReason: string) => request.put<ICommonResponse<any>>('/admin/refunds/' + orderId + '/reject', { rejectReason }),
}
