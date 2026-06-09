import request from './request'

export interface CouponItem {
  id: number; name: string; code: string; type: string
  amount: number; discountRate: number; minSpend: number
  startAt: string; endAt: string; status: string
}

export interface UserCouponItem {
  id: number; couponId: number; name: string; code: string; type: string
  amount: number; discountRate: number; minSpend: number
  status: string; receivedAt: string; usedAt: string; orderId: number
  endAt: string
}

export const couponApi = {
  getAvailable: () => request.get<{code:number;data:{list:CouponItem[];total:number}}>('/customer/coupons/available'),
  receive: (id: number) => request.post<{code:number;data:any}>('/customer/coupons/' + id + '/receive'),
  getMyCoupons: (params?: any) => request.get<{code:number;data:{list:UserCouponItem[];total:number}}>('/customer/coupons', { params }),
  getUsable: (amount: number) => request.get<{code:number;data:UserCouponItem[]}>('/customer/coupons/usable', { params: { amount } }),
}
