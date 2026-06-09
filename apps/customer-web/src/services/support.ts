import request from './request'

export interface SupportSession {
  id: number; sessionNo: string; sessionType: string; title: string
  status: string; priority: string; merchantId: number; merchantName: string
  lastMessage: string; lastMessageAt: string
  unreadCount: number; relatedProductId: number; relatedOrderId: number
  createdAt: string
}

export interface SupportMessage {
  id: number; sessionId: number; senderUserId: number
  senderRole: string; senderDisplayName: string; senderAvatar: string
  senderSide: string; content: string; messageType: string
  attachments: string; createdAt: string
}

export const supportApi = {
  getSessions: (params?: any) => request.get<{code:number;data:{list:SupportSession[];total:number}}>('/customer/support/sessions', { params }),
  getSessionDetail: (id: number) => request.get<{code:number;data:SupportSession}>('/customer/support/sessions/' + id),
  getMessages: (id: number) => request.get<{code:number;data:SupportMessage[]}>('/customer/support/sessions/' + id + '/messages'),
  createSession: (data: any) => request.post<{code:number;data:SupportSession}>('/customer/support/sessions', data),
  sendMessage: (id: number, data: any) => request.post<{code:number;data:SupportMessage}>('/customer/support/sessions/' + id + '/messages', data),
  closeSession: (id: number, reason?: string) => request.put<{code:number;data:any}>('/customer/support/sessions/' + id + '/close', { closeReason: reason || '' }),
  markRead: (id: number) => request.put<{code:number;data:any}>('/customer/support/sessions/' + id + '/read'),
}
