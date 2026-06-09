import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'

export interface IAdminSupportSession {
  id: number; sessionNo: string; sessionType: string; title: string
  status: string; priority: string; merchantId: number; merchantName: string
  customerUserId: number; customerName: string
  lastMessage: string; lastMessageAt: string
  customerUnread: number; merchantUnread: number
  relatedProductId: number; relatedOrderId: number
  firstResponseAt: string; firstResponseSeconds: number
  inspectionId: number; operatorId: number; operatorName: string
  qualityScore: number; qualityRemark: string
  createdAt: string
}

export interface ISupportMessage {
  id: number; sessionId: number; senderUserId: number
  senderRole: string; senderDisplayName: string; senderAvatar: string
  senderSide: string; content: string; messageType: string
  attachments: string; createdAt: string
}

export interface IInspectionSession {
  id: number; sessionId: number; merchantId: number; merchantName: string
  fakeCustomerName: string; customerUserId: number
  productId: number; question: string
  status: string; priority: string
  firstResponseSeconds: number; qualityScore: number; qualityRemark: string
  createdAt: string
}

export interface IQuickReply {
  id: number; title: string; content: string; languageCode: string
  sort: number; merchantId: number; status: string; createdAt: string
}

export const customerMerchantApi = {
  getSessions: (params: any) => request.get<ICommonResponse<{list:IAdminSupportSession[];total:number}>>('/admin/support/customer-merchant-sessions', { params }),
  getSessionDetail: (id: number) => request.get<ICommonResponse<{ session: IAdminSupportSession; messages: ISupportMessage[] }>>('/admin/support/customer-merchant-sessions/' + id),
  getMessages: (id: number) => request.get<ICommonResponse<ISupportMessage[]>>('/admin/support/sessions/' + id + '/messages'),
  closeSession: (id: number, reason?: string) => request.put<ICommonResponse<any>>('/admin/support/customer-merchant-sessions/' + id + '/close', { closeReason: reason || '' }),
  markRead: (id: number) => request.put<ICommonResponse<any>>('/admin/support/sessions/' + id + '/read'),
}

export const platformSupportApi = {
  getSessions: (params: any) => request.get<ICommonResponse<{list:IAdminSupportSession[];total:number}>>('/admin/support/platform-sessions', { params }),
  getSessionDetail: (id: number) => request.get<ICommonResponse<{ session: IAdminSupportSession; messages: ISupportMessage[] }>>('/admin/support/platform-sessions/' + id),
  getMessages: (id: number) => request.get<ICommonResponse<ISupportMessage[]>>('/admin/support/sessions/' + id + '/messages'),
  sendMessage: (id: number, data: any) => request.post<ICommonResponse<ISupportMessage>>('/admin/support/platform-sessions/' + id + '/messages', data),
  closeSession: (id: number, reason?: string) => request.put<ICommonResponse<any>>('/admin/support/platform-sessions/' + id + '/close', { closeReason: reason || '' }),
}

export const inspectionApi = {
  getList: (params: any) => request.get<ICommonResponse<{list:IInspectionSession[];total:number}>>('/admin/support/inspection-sessions', { params }),
  create: (data: any) => request.post<ICommonResponse<IInspectionSession>>('/admin/support/inspection-sessions', data),
  getMessages: (sessionId: number) => request.get<ICommonResponse<ISupportMessage[]>>('/admin/support/sessions/' + sessionId + '/messages'),
  score: (id: number, data: {qualityScore:number; qualityRemark:string}) => request.put<ICommonResponse<any>>('/admin/support/inspection-sessions/' + id + '/score', data),
}

export const quickReplyAdminApi = {
  getList: (params: any) => request.get<ICommonResponse<{list:IQuickReply[];total:number}>>('/admin/support/quick-replies', { params }),
  create: (data: any) => request.post<ICommonResponse<IQuickReply>>('/admin/support/quick-replies', data),
  update: (id: number, data: any) => request.put<ICommonResponse<IQuickReply>>('/admin/support/quick-replies/' + id, data),
  delete: (id: number) => request.delete<ICommonResponse<any>>('/admin/support/quick-replies/' + id),
}
