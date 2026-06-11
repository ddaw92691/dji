import request from '@/utils/request';
export const notificationApi = {
    getNotifications: (params) => request.get('/admin/notifications', { params }),
    getUnreadCount: () => request.get('/admin/notifications/unread-count'),
    markAsRead: (id) => request.put(`/admin/notifications/${id}/read`),
    markAllAsRead: () => request.put('/admin/notifications/read-all'),
};
