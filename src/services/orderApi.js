import api from './api';

/**
 * Order endpoints. Mirrors the existing *Api.js service style.
 * The profile hook falls back to sample orders when these are unavailable.
 */
export const orderApi = {
  getMine: () => api.get('/orders/me'),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
};
