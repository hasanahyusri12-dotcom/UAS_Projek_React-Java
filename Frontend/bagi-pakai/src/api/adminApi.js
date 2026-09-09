import { api } from './client';

export const adminApi = {
  // Get dashboard metrics
  getDashboard: async () => {
    return await api.get('/api/admin/dashboard');
  },

  // Get pending items for review
  getPendingItems: async () => {
    return await api.get('/api/admin/items/pending');
  },

  // Approve item (sets status to TERSEDIA)
  approveItem: async (id) => {
    return await api.put(`/api/admin/items/${id}/approve`);
  },

  // Reject item (sets status to DITOLAK)
  rejectItem: async (id) => {
    return await api.put(`/api/admin/items/${id}/reject`);
  },

  // Get all registered users
  getUsers: async () => {
    return await api.get('/api/admin/users');
  },

  // Suspend a user
  suspendUser: async (id) => {
    return await api.put(`/api/admin/users/${id}/suspend`);
  },

  // Activate a user
  activateUser: async (id) => {
    return await api.put(`/api/admin/users/${id}/activate`);
  },

  // Change user role
  changeRole: async (id, role) => {
    return await api.put(`/api/admin/users/${id}/role?role=${role}`);
  },
};
