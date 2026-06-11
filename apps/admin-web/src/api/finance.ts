import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'

export interface IAdminFinanceSummary {
  totalSales: number; todaySales: number
  totalMerchantBalance: number; totalMerchantFrozenBalance: number
  totalAgentBalance: number; totalAgentFrozenBalance: number
  totalCommission: number; totalWithdrawn: number
  pendingWithdrawalAmount: number; pendingWithdrawalCount: number
  paidOrderCount: number; completedOrderCount: number
}

export interface IAdminWithdrawal {
  id: number; userId: number; userName: string; role: string; type: string
  amount: number; status: string
  bankName: string; bankAccount: string; accountName: string
  remark: string; rejectReason: string
  reviewedBy: number; reviewedAt: string; createdAt: string
}

export interface IAdminCommission {
  id: number; orderId: number; orderNo: string
  agentId: number; agentName: string; buyerUserId: number
  amount: number; rate: number; status: string
  createdAt: string; settledAt: string
}

export interface IAdminPayment {
  id: number; paymentNo: string; orderId: number; userId: number
  amount: number; method: string; status: string
  transactionNo: string; paidAt: string; createdAt: string
}

export const financeApi = {
  getOverview: () => request.get<ICommonResponse<IAdminFinanceSummary>>('/admin/finance/overview'),
  getWithdrawals: (params: any) => request.get<ICommonResponse<{list:IAdminWithdrawal[];total:number}>>('/admin/withdrawals', { params }),
  getWithdrawalDetail: (id: number) => request.get<ICommonResponse<IAdminWithdrawal>>('/admin/withdrawals/' + id),
  approveWithdrawal: (id: number) => request.put<ICommonResponse<any>>('/admin/withdrawals/' + id + '/approve'),
  rejectWithdrawal: (id: number, rejectReason: string) => request.put<ICommonResponse<any>>('/admin/withdrawals/' + id + '/reject', { rejectReason }),
  getCommissions: (params: any) => request.get<ICommonResponse<{list:IAdminCommission[];total:number}>>('/admin/commissions', { params }),
  getPayments: (params: any) => request.get<ICommonResponse<{list:IAdminPayment[];total:number}>>('/admin/payments', { params }),
  getFundLogs: (params: any) => request.get<ICommonResponse<{list:any[];total:number}>>('/admin/finance/fund-logs', { params }),
}
