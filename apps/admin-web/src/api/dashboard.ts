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
  pendingRefunds: number
  totalSales: number
  todayOrders: number
  todaySales: number
  totalCommission: number
  pendingWithdrawals: number
  recentOrders: any[]
  recentRefunds: any[]
}

export interface IChartPoint {
  date?: string
  amount?: number
  count?: number
  name?: string
  value?: number
}

export interface IAdminDashboardCharts {
  salesTrend: IChartPoint[]
  orderTrend: IChartPoint[]
  orderStatusDistribution: IChartPoint[]
  userRoleDistribution: IChartPoint[]
}

export const dashboardApi = {
  getOverview: () => request.get<ICommonResponse<IAdminDashboard>>('/admin/dashboard'),
  getCharts: () => request.get<ICommonResponse<IAdminDashboardCharts>>('/admin/dashboard/charts'),
}
