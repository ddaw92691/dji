import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'

export interface IFinanceSummary {
  role: string
  balance: number
  frozenBalance: number
  totalSales?: number
  totalCommission?: number
  totalWithdrawn: number
  pendingWithdrawalAmount: number
  completedOrders?: number
  paidOrders?: number
  settledCommissions?: number
  frozenCommissions?: number
}

export interface ICommissionRecord {
  id: number
  orderId: number
  orderNo: string
  amount: number
  rate: number
  status: string
  buyerUserId: number
  createdAt: string
  settledAt: string
}

export interface IWithdrawalRecord {
  id: number
  amount: number
  status: string
  role: string
  type: string
  bankName: string
  bankAccount: string
  accountName: string
  remark: string
  rejectReason: string
  reviewedAt: string
  createdAt: string
}

export const financeApi = {
  getSummary: () => request.get<ICommonResponse<IFinanceSummary>>('/merchant/finance/summary'),
  getCommissions: (params: any) =>
    request.get<ICommonResponse<{ list: ICommissionRecord[]; total: number }>>(
      '/merchant/finance/commissions',
      { params },
    ),
  getWithdrawals: (params: any) =>
    request.get<ICommonResponse<{ list: IWithdrawalRecord[]; total: number }>>(
      '/merchant/finance/withdrawals',
      { params },
    ),
  applyWithdrawal: (data: any) =>
    request.post<ICommonResponse<any>>('/merchant/finance/withdrawals', data),
  getFundLogs: (params: any) =>
    request.get<ICommonResponse<{ list: any[]; total: number; balance: number; frozenBalance: number }>>(
      '/merchant/finance/fund-logs',
      { params },
    ),
}
