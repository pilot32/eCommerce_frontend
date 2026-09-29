import api from './api';

export const addressApi = {
  getAll: () => api.get('/addresses'),
  getDefault: () => api.get('/addresses/default'),
  getById: (id) => api.get(`/addresses/${id}`),
  create: (data) => api.post('/addresses', data),
  update: (id, data) => api.patch(`/addresses/${id}`, data),
  setDefault: (id) => api.patch(`/addresses/${id}/default`),
  delete: (id) => api.delete(`/addresses/${id}`),
};
