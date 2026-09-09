import { api } from './client';

export const itemsApi = {
  // Get items with filtering, search, pagination, and sorting
  getItems: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.kategori) query.append('kategori', params.kategori);
    if (params.status) query.append('status', params.status);
    if (params.ownerUsername) query.append('ownerUsername', params.ownerUsername);
    if (params.sort) query.append('sort', params.sort);
    if (params.direction) query.append('direction', params.direction);
    if (params.page !== undefined) query.append('page', params.page);
    if (params.size !== undefined) query.append('size', params.size);

    const queryString = query.toString();
    return await api.get(`/api/items${queryString ? `?${queryString}` : ''}`);
  },

  // Get single item by ID
  getItemById: async (id) => {
    return await api.get(`/api/items/${id}`);
  },

  // Get items posted by logged-in user
  getMyItems: async () => {
    return await api.get('/api/items/mine');
  },

  // Create new item (status will be MENUNGGU_REVIEW)
  createItem: async (itemData) => {
    return await api.post('/api/items', itemData);
  },

  // Update item
  updateItem: async (id, itemData) => {
    return await api.put(`/api/items/${id}`, itemData);
  },

  // Delete item
  deleteItem: async (id) => {
    return await api.delete(`/api/items/${id}`);
  },

  // Upload item photo
  uploadPhoto: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post(`/api/items/${id}/foto`, formData);
  },
};
