import { api } from './client';

export const notificationsApi = {
  // Get all notifications
  getAll: async () => {
    return await api.get('/api/notifications');
  },

  // Get unread notifications count
  getUnreadCount: async () => {
    return await api.get('/api/notifications/unread-count');
  },

  // Mark notification as read
  markAsRead: async (id) => {
    return await api.put(`/api/notifications/${id}/read`);
  },
};
