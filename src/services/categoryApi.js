import api from './api';

export const categoryApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.patch(`/categories/${id}`, data),
  updateStatus: (id, data) => api.patch(`/categories/${id}/status`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};