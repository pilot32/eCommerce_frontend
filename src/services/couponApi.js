
import api from './api';

export const couponApi = {
  getAll: (params) => api.get('/coupon', { params }),
  getById: (id) => api.get(`/coupon/${id}`),
  create: (data) => api.post('/coupon', data),
  update: (id, data) => api.patch(`/coupon/${id}`, data),
  updateStatus: (id, data) => api.patch(`/coupon/${id}/status`, data),
  delete: (id) => api.delete(`/coupon/${id}`),
};
