import API from './api';

export const experienceAPI = {
//   getAll: () => API.get('/company/employee-awards/'),
//   getAllActive: () => API.get('/company/employee-awards/'),
  create: (id) => API.post(`/company/${id}/experience/`),
  getById: (id) => API.get(`/company/${id}/experience/`),
  update: (id, data) => API.put(`/company/${id}/experience/`, data),
  patch: (id, data) => API.patch(`/company/${id}/experience/`, data),
  delete: (id) => API.delete(`/company/${id}/experience/`),
};
