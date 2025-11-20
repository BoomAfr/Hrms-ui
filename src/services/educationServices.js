import API from './api';

export const educationAPI = {
//   getAll: () => API.get('/company/employee-awards/'),
//   getAllActive: () => API.get('/company/employee-awards/'),
  create: (id) => API.post(`/company/${id}/education/`),
  getById: (id) => API.get(`/company/${id}/education/`),
  update: (id, data) => API.put(`/company/${id}/education/`, data),
  patch: (id, data) => API.patch(`/company/${id}/education/`, data),
  delete: (id) => API.delete(`/company/${id}/education/`),
};
