import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'

export interface ISupportSession {
  id: number; sessionNo: string; sessionType: string; title: string
  status: string; priority: string; customerUserId: number; customerName: string
  lastMessage: string; lastMessageAt: string
  unreadCount: number; relatedProductId: number; relatedOrderId: number
  firstResponseAt: string; createdAt: string
}

export interface ISupportMessage {
  id: number; sessionId: number; senderUserId: number
  senderRole: string; senderDisplayName: string; senderAvatar: string
  senderSide: string; content: string; messageType: string
  attachments: string; createdAt: string
}

export interface IQuickReply {
  id: number; title: string; content: string; languageCode: string
  sort: number; status: string; createdAt: string
}

export const customerSupportApi = {
  getSessions: (params: any) => request.get<ICommonResponse<{list:ISupportSession[];total:number}>>('/merchant/support/customer-sessions', { params }),
  getSessionDetail: (id: number) => request.get<ICommonResponse<{ session: ISupportSession; messages: ISupportMessage[] }>>('/merchant/support/customer-sessions/' + id),
  getMessages: (id: number) => request.get<ICommonResponse<ISupportMessage[]>>('/merchant/support/customer-sessions/' + id + '/messages'),
  sendMessage: (id: number, data: any) => request.post<ICommonResponse<ISupportMessage>>('/merchant/support/customer-sessions/' + id + '/messages', data),
  closeSession: (id: number, reason?: string) => request.put<ICommonResponse<any>>('/merchant/support/customer-sessions/' + id + '/close', { closeReason: reason || '' }),
  markRead: (id: number) => request.put<ICommonResponse<any>>('/merchant/support/sessions/' + id + '/read'),
}

export const platformSupportApi = {
  getSessions: (params: any) => request.get<ICommonResponse<{list:ISupportSession[];total:number}>>('/merchant/support/platform-sessions', { params }),
  getSessionDetail: (id: number) => request.get<ICommonResponse<ISupportSession>>('/merchant/support/platform-sessions/' + id),
  getMessages: (id: number) => request.get<ICommonResponse<ISupportMessage[]>>('/merchant/support/platform-sessions/' + id + '/messages'),
  createSession: (data: any) => request.post<ICommonResponse<ISupportSession>>('/merchant/support/platform-sessions', data),
  sendMessage: (id: number, data: any) => request.post<ICommonResponse<ISupportMessage>>('/merchant/support/platform-sessions/' + id + '/messages', data),
  closeSession: (id: number, reason?: string) => request.put<ICommonResponse<any>>('/merchant/support/platform-sessions/' + id + '/close', { closeReason: reason || '' }),
}

export const quickReplyApi = {
  getList: (params: any) => request.get<ICommonResponse<{list:IQuickReply[];total:number}>>('/merchant/support/quick-replies', { params }),
  create: (data: any) => request.post<ICommonResponse<IQuickReply>>('/merchant/support/quick-replies', data),
  update: (id: number, data: any) => request.put<ICommonResponse<IQuickReply>>('/merchant/support/quick-replies/' + id, data),
  delete: (id: number) => request.delete<ICommonResponse<any>>('/merchant/support/quick-replies/' + id),
}
