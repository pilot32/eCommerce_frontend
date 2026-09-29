import api from './api';

export const productApi = {
  getAll: (params) => api.get('/products', { params }),
  getCustomerAll: (params) => api.get('/customer/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.patch(`/products/${id}`, data),
  updateStatus: (id, data) => api.patch(`/products/${id}/status`, data),
  delete: (id) => api.delete(`/products/${id}`),

};

//function to upload the images to backend->cloudinary->then frontend 

export const uploadImages = (file) => {
  const formData = new FormData();
  formData.append('image',file);  
  return api.post('/products/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
