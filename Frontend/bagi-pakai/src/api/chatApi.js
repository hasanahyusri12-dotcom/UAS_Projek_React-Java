import { api } from './client';

export const chatApi = {
  // Get all conversations for current user
  getConversations: async () => {
    return await api.get('/api/conversations');
  },

  // Get messages for a specific conversation
  getMessages: async (conversationId) => {
    return await api.get(`/api/conversations/${conversationId}/messages`);
  },

  // Start chat with the item owner (creates conversation if not exists)
  startConversation: async (itemId) => {
    return await api.post(`/api/conversations/${itemId}`);
  },

  // Send a message
  sendMessage: async (conversationId, content) => {
    return await api.post(`/api/conversations/${conversationId}/messages`, { content });
  },
};
