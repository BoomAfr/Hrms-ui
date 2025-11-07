import API from './api';

export const designationAPI = {
  getAll: () => API.get('/company/designations/'),
  create: (data) => API.post('/company/designations/', data),
  getById: (id) => API.get(`/company/designations/${id}/`),
  update: (id, data) => API.put(`/company/designations/${id}/`, data),
  patch: (id, data) => API.patch(`/company/designations/${id}/`, data),
  delete: (id) => API.delete(`/company/designations/${id}/`),
};