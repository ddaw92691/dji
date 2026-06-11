import request from '@/utils/request';
export const agentApi = {
    getAgents: (params) => request.get('/admin/agents', { params }),
    createAgent: (data) => request.post('/admin/agents', data),
    updateAgent: (id, data) => request.put('/admin/agents/' + id, data),
    updateAgentStatus: (id, status) => request.put('/admin/agents/' + id + '/status', { status }),
    getAgentCustomers: (id, params) => request.get('/admin/agents/' + id + '/customers', { params }),
    getAgentCommissions: (id, params) => request.get('/admin/agents/' + id + '/commissions', { params }),
};
