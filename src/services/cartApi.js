import api from './api';

export const cartApi = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  updateQuantity: (productId, data) => api.patch(`/cart/${productId}`, data),
  remove: (productId) => api.delete(`/cart/${productId}`),
  clear: () => api.delete('/cart'),
  applyCoupon: (data) => api.post('/cart/apply-coupon', data),
  removeCoupon: () => api.delete('/cart/coupon'),
};
