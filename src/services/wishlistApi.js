import api from './api';

export const wishlistApi = {
  get: () => api.get('/wishlist'),
  add: (data) => api.post('/wishlist', data),
  check: (productId) => api.get(`/wishlist/check/${productId}`),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
  clear: () => api.delete('/wishlist'),
};
