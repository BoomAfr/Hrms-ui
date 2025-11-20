import API from './api';

export const manageEmployeeApi = {
  getAll: () => API.get('/company/employees/'),
  create: (data) => API.post('/company/employees/create/', data),
  delete: (id) => API.delete(`/company/employees/${id}/`),
  getById: (id) =>API.get(`/company/employees/${id}/`),
  update: (id,data) =>API.put(`/company/employees/${id}/`,data),

};
