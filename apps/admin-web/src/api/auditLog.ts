import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'

export interface IAuditLog {
  id: number
  userId: number
  userEmail: string
  action: string
  targetType: string
  targetId: string
  detail: string
  ip: string
  createdAt: string
}

export const auditLogApi = {
  getLogs: (params: any) => request.get<ICommonResponse<{ list: IAuditLog[]; total: number }>>('/admin/audit-logs', { params }),
}
