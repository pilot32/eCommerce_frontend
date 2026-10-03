import api from './api';

export const shippingApi = {
  getQuote: (data) => api.post('/shipping/quote', data),
};
