import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'

export interface IAdminCoupon {
  id: number
  name: string
  code: string
  type: string
  amount: number
  discountRate: number
  minSpend: number
  totalQuantity: number
  receivedQuantity: number
  usedQuantity: number
  perUserLimit: number
  startAt: string
  endAt: string
  status: string
  translations: ICouponTranslation[]
  createdAt: string
}

export interface ICouponTranslation {
  languageCode: string
  name: string
  description: string
}

export interface ICouponRecord {
  id: number
  userId: number
  userName: string
  couponId: number
  couponName: string
  status: string
  usedOrderNo: string
  receivedAt: string
  usedAt: string
}

export const couponApi = {
  getCoupons: (params: any) => request.get<ICommonResponse<{ list: IAdminCoupon[]; total: number }>>('/admin/coupons', { params }),
  createCoupon: (data: any) => request.post<ICommonResponse<IAdminCoupon>>('/admin/coupons', data),
  updateCoupon: (id: number, data: any) => request.put<ICommonResponse<IAdminCoupon>>('/admin/coupons/' + id, data),
  updateCouponStatus: (id: number, status: string) => request.put<ICommonResponse<any>>('/admin/coupons/' + id + '/status', { status }),
  deleteCoupon: (id: number) => request.delete<ICommonResponse<any>>('/admin/coupons/' + id),
  getRecords: (id: number, params: any) => request.get<ICommonResponse<{ list: ICouponRecord[]; total: number }>>('/admin/coupons/' + id + '/records', { params }),
}
