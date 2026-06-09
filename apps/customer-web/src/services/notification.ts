import request from './request'

export interface NotificationItem {
  id: number
  userId: number
  title: string
  content: string
  type: string
  targetId: number | null
  targetType: string | null
  isRead: boolean
  createdAt: string
}

export const notificationApi = {
  getNotifications: (params?: { page?: number; pageSize?: number; type?: string; unreadOnly?: boolean }) =>
    request.get('/customer/notifications', { params }),

  getUnreadCount: () =>
    request.get('/customer/notifications/unread-count'),

  markAsRead: (id: number) =>
    request.put(`/customer/notifications/${id}/read`),

  markAllAsRead: () =>
    request.put('/customer/notifications/read-all'),
}
