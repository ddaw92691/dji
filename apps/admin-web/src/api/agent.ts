import request from '@/utils/request'

export const agentApi = {
  getAgents: (params: Record<string, unknown>) =>
    request.get('/admin/agents', { params }),
  createAgent: (data: Record<string, unknown>) =>
    request.post('/admin/agents', data),
  updateAgent: (id: string | number, data: Record<string, unknown>) =>
    request.put('/admin/agents/' + id, data),
  updateAgentStatus: (id: string | number, status: string) =>
    request.put('/admin/agents/' + id + '/status', { status }),
  getAgentCustomers: (id: string | number, params: Record<string, unknown>) =>
    request.get('/admin/agents/' + id + '/customers', { params }),
  getAgentCommissions: (id: string | number, params: Record<string, unknown>) =>
    request.get('/admin/agents/' + id + '/commissions', { params }),
}
