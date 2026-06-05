import api from './api';

export const productApi = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.patch(`/products/${id}`, data),
  updateStatus: (id, data) => api.patch(`/products/${id}/status`, data),
  delete: (id) => api.delete(`/products/${id}`),
};