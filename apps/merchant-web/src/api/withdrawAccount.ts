import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'

export interface IWithdrawAccount {
  id: number
  type: string // CRYPTO / BANK
  chain?: string
  address?: string
  bankName?: string
  accountNo?: string
  accountName?: string
  swiftCode?: string
  country?: string
  remark?: string
  isDefault?: boolean
  status?: string
  createdAt?: string
}

export const withdrawAccountApi = {
  list: () => request.get<ICommonResponse<IWithdrawAccount[]>>('/merchant/withdraw-accounts'),
  create: (data: Partial<IWithdrawAccount>) =>
    request.post<ICommonResponse<any>>('/merchant/withdraw-accounts', data),
  update: (id: number, data: Partial<IWithdrawAccount>) =>
    request.put<ICommonResponse<any>>('/merchant/withdraw-accounts/' + id, data),
  remove: (id: number) =>
    request.delete<ICommonResponse<any>>('/merchant/withdraw-accounts/' + id),
  setDefault: (id: number) =>
    request.put<ICommonResponse<any>>('/merchant/withdraw-accounts/' + id + '/default', {}),
}
