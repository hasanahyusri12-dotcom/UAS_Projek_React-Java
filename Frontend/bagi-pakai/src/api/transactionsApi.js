import { api } from './client';

export const transactionsApi = {
  // Get my transactions (as giver or receiver)
  getMyTransactions: async () => {
    return await api.get('/api/transactions');
  },

  // Get transaction details
  getTransactionById: async (id) => {
    return await api.get(`/api/transactions/${id}`);
  },

  // Receiver marks item as received
  markAsReceived: async (id) => {
    return await api.put(`/api/transactions/${id}/received`);
  },

  // Receiver confirms completion (sets item status to SELESAI)
  confirmCompletion: async (id) => {
    return await api.put(`/api/transactions/${id}/confirm`);
  },
};
