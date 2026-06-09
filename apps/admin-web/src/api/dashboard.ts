import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'

export interface IAdminDashboard {
  totalUsers: number
  totalCustomers: number
  totalMerchants: number
  totalAgents: number
  totalProducts: number
  pendingProducts: number
  totalOrders: number
  paidOrders: number
  completedOrders: number
  refundRequests: number
  totalSales: number
  todaySales: number
  totalCommission: number
  pendingWithdrawals: number
  recentOrders: any[]
  recentRefunds: any[]
}

export const dashboardApi = {
  getOverview: () => request.get<ICommonResponse<IAdminDashboard>>('/admin/dashboard'),
}
