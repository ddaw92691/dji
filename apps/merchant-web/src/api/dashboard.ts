import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'

export interface IMerchantDashboard {
  role: string
  todayOrders: number
  todaySales: number
  totalOrders: number
  totalSales: number
  paidOrders: number
  shippedOrders: number
  completedOrders: number
  balance: number
  frozenBalance: number
  invitedCustomers: number
  totalCommission: number
  settledCommissions: number
  frozenCommissions: number
  recentOrders: any[]
  recentCommissions: any[]
}

export const dashboardApi = {
  getOverview: () => request.get<ICommonResponse<IMerchantDashboard>>('/merchant/dashboard'),
}
