import API from './api';

export const experienceAPI = {
//   getAll: () => API.get('/company/employee-awards/'),
//   getAllActive: () => API.get('/company/employee-awards/'),
  create: (id,data) => API.post(`/company/employees/${id}/experience/`,data),
  getById: (id) => API.get(`/company/${id}/experience/`),
  update: (id, data) => API.patch(`/company/employees/${id}/experience/`, data),
  patch: (id, data) => API.patch(`/company/${id}/experience/`, data),
  delete: (id) => API.delete(`/company/${id}/experience/`),
};
