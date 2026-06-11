import request from '@/utils/request'

export const merchantApi = {
  getMerchants: (params: Record<string, unknown>) =>
    request.get('/admin/merchants', { params }),
  createMerchant: (data: Record<string, unknown>) =>
    request.post('/admin/merchants', data),
  updateMerchant: (id: string | number, data: Record<string, unknown>) =>
    request.put('/admin/merchants/' + id, data),
  updateMerchantStatus: (id: string | number, status: string) =>
    request.put('/admin/merchants/' + id + '/status', { status }),
  getFundLogs: (id: string | number, params: Record<string, unknown>) =>
    request.get('/admin/merchants/' + id + '/fund-logs', { params }),
  getWallet: (id: string | number) =>
    request.get('/admin/merchants/' + id + '/wallet'),
  adjustFund: (id: string | number, data: Record<string, unknown>) =>
    request.post('/admin/merchants/' + id + '/fund-adjust', data),
  addFund: (id: string | number, data: Record<string, unknown>) =>
    request.post('/admin/merchants/' + id + '/wallet/add', data),
  subtractFund: (id: string | number, data: Record<string, unknown>) =>
    request.post('/admin/merchants/' + id + '/wallet/subtract', data),
  freezeFund: (id: string | number, data: Record<string, unknown>) =>
    request.post('/admin/merchants/' + id + '/wallet/freeze', data),
  unfreezeFund: (id: string | number, data: Record<string, unknown>) =>
    request.post('/admin/merchants/' + id + '/wallet/unfreeze', data),
  resetLoginPassword: (id: string | number, password: string) =>
    request.put('/admin/merchants/' + id + '/login-password', { password }),
  resetWithdrawPassword: (id: string | number, password: string) =>
    request.put('/admin/merchants/' + id + '/withdraw-password', { password }),
  getWithdrawAccounts: (id: string | number) =>
    request.get('/admin/merchants/' + id + '/withdraw-accounts'),
  createWithdrawAccount: (merchantId: string | number, data: Record<string, unknown>) =>
    request.post('/admin/merchant-withdraw-accounts', data, { params: { merchantId } }),
  updateWithdrawAccount: (accountId: string | number, data: Record<string, unknown>) =>
    request.put('/admin/merchant-withdraw-accounts/' + accountId, data),
  deleteWithdrawAccount: (accountId: string | number) =>
    request.delete('/admin/merchant-withdraw-accounts/' + accountId),
}
