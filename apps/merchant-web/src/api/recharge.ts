import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'

export interface IRechargeRecord {
  id: number
  rechargeNo: string
  amount: number
  currency: string
  method: string
  proofUrl: string
  status: string
  remark: string
  rejectReason: string
  reviewedAt: string
  createdAt: string
}

export const rechargeApi = {
  getRecharges: (params: any) =>
    request.get<ICommonResponse<{ list: IRechargeRecord[]; total: number }>>('/merchant/recharges', {
      params,
    }),
  submitRecharge: (data: any) =>
    request.post<ICommonResponse<any>>('/merchant/recharges', data),
}
