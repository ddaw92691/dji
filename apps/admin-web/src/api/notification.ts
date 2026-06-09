import request from '@/utils/request'
import type { ICommonResponse, ICommonPageResponse } from '@/types/common'

export interface NotificationItem {
  id: number
  userId: number
  userName: string
  title: string
  content: string
  type: string
  targetId: number | null
  targetType: string | null
  isRead: boolean
  createdAt: string
}

export const notificationApi = {
  getNotifications: (params?: any) =>
    request.get<ICommonPageResponse<NotificationItem[]>>('/admin/notifications', { params }),

  getUnreadCount: () =>
    request.get<ICommonResponse<number>>('/admin/notifications/unread-count'),

  markAsRead: (id: number) =>
    request.put<ICommonResponse<any>>(`/admin/notifications/${id}/read`),

  markAllAsRead: () =>
    request.put<ICommonResponse<any>>('/admin/notifications/read-all'),
}
