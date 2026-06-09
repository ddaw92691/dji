import request from '@/utils/request'
import type { ICommonResponse, ICommonPageResponse } from '@/types/common'

export interface TaxNotice {
  id: number
  merchantId: number
  merchantName: string
  title: string
  content: string
  taxType: string
  amount: number
  currency: string
  status: string
  forcePopup: boolean
  blockUntilPaid: boolean
  dueAt: string
  paidAt: string | null
  paymentMethod: string | null
  paymentProof: string | null
  proofRemark: string | null
  rejectReason: string | null
  createdAt: string
  updatedAt: string
}

export const taxApi = {
  getTaxNotices: (params?: any) =>
    request.get<ICommonPageResponse<TaxNotice[]>>('/admin/tax/notices', { params }),

  createTaxNotice: (data: any) =>
    request.post<ICommonResponse<TaxNotice>>('/admin/tax/notices', data),

  updateTaxNotice: (id: number, data: any) =>
    request.put<ICommonResponse<TaxNotice>>(`/admin/tax/notices/${id}`, data),

  cancelTaxNotice: (id: number) =>
    request.put<ICommonResponse<any>>(`/admin/tax/notices/${id}/cancel`),

  reviewTaxNotice: (id: number, data: { approved: boolean; rejectReason?: string }) =>
    request.put<ICommonResponse<any>>(`/admin/tax/notices/${id}/review`, data),
}
