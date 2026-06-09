import request from '@/utils/request'

export const agentApi = {
  getInvite: () => request.get('/merchant/agent/invite'),
  getCustomers: (params: Record<string, unknown>) =>
    request.get('/merchant/agent/customers', { params }),
  getTeam: (params: Record<string, unknown>) =>
    request.get('/merchant/agent/team', { params }),
}
