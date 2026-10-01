import api from './api';

// ─── Hero Slides (/api/home/hero-slides) ───────────────────────────────────
export const heroSlidesApi = {
  /** GET /hero-slides?activeOnly=false  (admin sees all, incl. inactive) */
  getAll: (activeOnly = false) =>
    api.get('/home/hero-slides', { params: { activeOnly } }),

  /** POST /hero-slides */
  create: (data) => api.post('/home/hero-slides', data),

  /** PATCH /hero-slides/:id */
  update: (id, data) => api.patch(`/home/hero-slides/${id}`, data),

  /** PATCH /hero-slides/:id/status  – { isActive: boolean } */
  updateStatus: (id, data) => api.patch(`/home/hero-slides/${id}/status`, data),

  /** DELETE /hero-slides/:id */
  delete: (id) => api.delete(`/home/hero-slides/${id}`),
};

// ─── Promo Banners (/api/home/promo-banners) ───────────────────────────────
export const promoBannersApi = {
  /** GET /promo-banners?activeOnly=false */
  getAll: (activeOnly = false) =>
    api.get('/home/promo-banners', { params: { activeOnly } }),

  /** POST /promo-banners */
  create: (data) => api.post('/home/promo-banners', data),

  /** PATCH /promo-banners/:id */
  update: (id, data) => api.patch(`/home/promo-banners/${id}`, data),

  /** PATCH /promo-banners/:id/status  – { isActive: boolean } */
  updateStatus: (id, data) =>
    api.patch(`/home/promo-banners/${id}/status`, data),

  /** DELETE /promo-banners/:id */
  delete: (id) => api.delete(`/home/promo-banners/${id}`),
};

// Homepage category image tiles (separate from product category definitions).
export const categoryTilesApi = {
  getAll: (activeOnly = false) => api.get('/home/category-tiles', { params: { activeOnly } }),
  create: (data) => api.post('/home/category-tiles', data),
  update: (id, data) => api.patch(`/home/category-tiles/${id}`, data),
  updateStatus: (id, data) => api.patch(`/home/category-tiles/${id}/status`, data),
  delete: (id) => api.delete(`/home/category-tiles/${id}`),
};
