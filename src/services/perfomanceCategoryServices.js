import API from './api';

export const performanceCategoryAPI = {
  getAll: () => API.get('/company/performance-categories/'),
  getById: (id) => API.get(`/company/performance-categories/${id}/`),
  create: (data) => API.post('/company/performance-categories/', data),
  update: (id, data) => API.put(`/company/performance-categories/${id}/`, data),
  patch: (id, data) => API.patch(`/company/performance-categories/${id}/`, data),
  delete: (id) => API.delete(`/company/performance-categories/${id}/`),
};