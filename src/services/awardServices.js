import API from './api';

export const awardAPI = {
  getAll: (params = {}) => API.get('/company/employee-awards/', { params }),
  getAllActive: (params = {}) => API.get('/company/employee-awards/', { params }),
  create: (data) => API.post('/company/employee-awards/', data),
  getById: (id) => API.get(`/company/employee-awards/${id}/`),
  update: (id, data) => API.put(`/company/employee-awards/${id}/`, data),
  patch: (id, data) => API.patch(`/company/employee-awards/${id}/`, data),
  delete: (id) => API.delete(`/company/employee-awards/${id}/`),
};