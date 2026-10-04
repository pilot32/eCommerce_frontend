import api from './api';

export const paymentApi = {
  createRazorpayOrder: (data, idempotencyKey) => api.post('/payments/razorpay/order', data, {
    headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined,
  }),
  verifyRazorpayPayment: (data) => api.post('/payments/razorpay/verify', data),
};
