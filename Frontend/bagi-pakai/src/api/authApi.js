import { api } from './client';

export const authApi = {
  login: async (credentials) => {
    // credentials: { username, password }
    return await api.post('/api/auth/login', credentials);
  },

  register: async (userData) => {
    // userData: { username, email, password }
    return await api.post('/api/auth/register', userData);
  },
};
