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
    if (
      response.data &&
      typeof response.data === 'object' &&
      response.data.statusCode !== undefined &&
      response.data.data !== undefined
    ) {
      const { statusCode, message, data } = response.data;
      const url = response.config.url || '';

      if (Array.isArray(data)) {
        const transformed = [...data];
        transformed.statusCode = statusCode;
        transformed.message = message;

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

        response.data = transformed;
      } else if (data && typeof data === 'object') {
        const transformed = {
          ...data,
          statusCode,
          message,
        };

        if (url.includes('/categories') && !transformed.category) {
          transformed.category = data;
        } else if (url.includes('/products') && !transformed.product) {
          transformed.product = data;
        } else if (url.includes('/subcategories') && !transformed.subcategory) {
          transformed.subcategory = data;
        } else if (url.includes('/addresses') && !transformed.address) {
          transformed.address = data;
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
