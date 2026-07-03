import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    // If the response is wrapped in backend's custom ApiResponse { statusCode, message, data }
    if (
      response.data &&
      typeof response.data === 'object' &&
      response.data.statusCode !== undefined &&
      response.data.data !== undefined
    ) {
      const { statusCode, message, data } = response.data;
      const url = response.config.url || '';

      // We transform response.data to the raw data payload, but attach metadata and compatibility helper properties
      if (data && (Array.isArray(data) || typeof data === 'object')) {
        const transformed = data;
        transformed.statusCode = statusCode;
        transformed.message = message;
        transformed.data = data;

        if (Array.isArray(data)) {
          if (url.includes('/categories')) {
            transformed.categories = data;
          } else if (url.includes('/products')) {
            transformed.products = data;
          } else if (url.includes('/subcategories')) {
            transformed.subcategories = data;
          } else if (url.includes('/cart')) {
            transformed.cart = data;
          } else if (url.includes('/coupons') || url.includes('/coupon')) {
            transformed.coupons = data;
          } else if (url.includes('/addresses')) {
            transformed.addresses = data;
          }
        } else {
          if (url.includes('/categories')) {
            transformed.category = data;
          } else if (url.includes('/products')) {
            transformed.product = data;
          } else if (url.includes('/subcategories')) {
            transformed.subcategory = data;
          }
        }
        response.data = transformed;
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;