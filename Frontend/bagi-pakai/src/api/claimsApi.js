import { api } from './client';

export const claimsApi = {
  // Create claim request for an item with optional story/message
  createClaim: async (itemId, message) => {
    return await api.post(`/api/claims/items/${itemId}`, { message });
  },

  // Get claim requests sent by logged in user
  getMyClaims: async () => {
    return await api.get('/api/claims/mine');
  },

  // Get claim requests received for a specific item owned by user
  getClaimsByItem: async (itemId) => {
    return await api.get(`/api/claims/items/${itemId}`);
  },

  // Cancel a pending claim
  cancelClaim: async (claimId) => {
    return await api.put(`/api/claims/${claimId}/cancel`);
  },

  // Accept a claim request (giver chooses receiver -> creates transaction & chat)
  acceptClaim: async (claimId) => {
    return await api.put(`/api/claims/${claimId}/accept`);
  },
};
