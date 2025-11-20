import API from './api';

export const terminationAPI = {
  getAll: (params) => API.get('/company/terminations/', { params }),
  create: (payload) => API.post('/company/terminations/', payload),
  update: (id, data) => API.put(`/company/terminations/${id}/`, data),
  delete: (id) => API.delete(`/company/terminations/${id}/`),
};
