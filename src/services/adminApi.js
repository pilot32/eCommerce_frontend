import api from './api';

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
};
