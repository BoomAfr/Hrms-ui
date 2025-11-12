import API from './api';

export const designationAPI = {
  getAll: (page = 1, pageSize = 10, search = '') =>
    API.get(`/company/designations/?page=${page}&page_size=${pageSize}&search=${search}`),
  getAllActive: () => API.get('/company/designations/'),
  create: (data) => API.post('/company/designations/', data),
  getById: (id) => API.get(`/company/designations/${id}/`),
  update: (id, data) => API.put(`/company/designations/${id}/`, data),
  patch: (id, data) => API.patch(`/company/designations/${id}/`, data),
  delete: (id) => API.delete(`/company/designations/${id}/`),
};