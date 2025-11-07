import API from './api';

export const branchAPI = {
  getAll: () => API.get('/company/branches/'),
  create: (data) => API.post('/company/branches/', data),
  getById: (id) => API.get(`/company/branches/${id}/`),
  update: (id, data) => API.put(`/company/branches/${id}/`, data),
  patch: (id, data) => API.patch(`/company/branches/${id}/`, data),
  delete: (id) => API.delete(`/company/branches/${id}/`),
};
