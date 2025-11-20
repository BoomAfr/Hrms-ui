import API from './api';

export const departmentAPI = {
  getAll: (params) => API.get('/company/departments/', { params }),
  getAllActive: () => API.get('/company/departments/'),
  create: (data) => API.post('/company/departments/', data),
  getById: (id) => API.get(`/company/departments/${id}/`),
  update: (id, data) => API.put(`/company/departments/${id}/`, data),
  patch: (id, data) => API.patch(`/company/departments/${id}/`, data),
  delete: (id) => API.delete(`/company/departments/${id}/`),
};
