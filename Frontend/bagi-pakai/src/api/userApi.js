import { api } from './client';

export const userApi = {
  // Get currently logged-in user profile
  getMe: async () => {
    return await api.get('/api/users/me');
  },

  // Update profile
  updateProfile: async (profileData) => {
    // profileData: { fullName, phoneNumber, email }
    return await api.put('/api/users/me', profileData);
  },
};
