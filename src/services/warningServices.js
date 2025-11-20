import API from './api';

export const warningApi = {
  getAll: (params = {}) => API.get('/company/warnings/', { params }),
  getById: (id) => API.get(`/company/warnings/${id}/`),
  create: (payload) => API.post('/company/warnings/', payload),
  update: (id, payload) => API.put(`/company/warnings/${id}/`, payload),
  delete: (id) => API.delete(`/company/warnings/${id}/`),
};
