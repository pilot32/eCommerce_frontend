import api from './api';

export const cartApi = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  updateQuantity: (productId, data) => api.patch(`/cart/${productId}`, data),
  remove: (productId, selection) => api.delete(`/cart/${productId}`, { params: selection }),
  clear: () => api.delete('/cart'),
  applyCoupon: (data) => api.post('/cart/apply-coupon', data),
  removeCoupon: () => api.delete('/cart/coupon'),
};
