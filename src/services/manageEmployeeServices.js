import API from './api';

export const manageEmployeeApi = {
  getAll: () => API.get('/company/employees/'),
  create: (data) => API.post('/company/employees/create/', data),
  update: (id, data) => API.put(`/company/employees/${id}/`, data),
  getById: (id) => API.get(`/company/employees/${id}/`),


};
