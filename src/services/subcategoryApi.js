import api from './api';

export const subcategoryApi = {
  getAll: (params) => api.get('/subcategories', { params }),
  getById: (id) => api.get(`/subcategories/${id}`),
  create: (data) => api.post('/subcategories', data),
  update: (id, data) => api.patch(`/subcategories/${id}`, data),
  updateStatus: (id, data) => api.patch(`/subcategories/${id}/status`, data),
  delete: (id) => api.delete(`/subcategories/${id}`),
};