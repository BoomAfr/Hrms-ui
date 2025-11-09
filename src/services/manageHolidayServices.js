import API from './api';

export const manageHolidayAPI = {
  getAll: () => API.get('/company/leave/setup/holidays/'),
  create: (data) => API.post('/company/leave/setup/holidays/', data),
  getById: (id) => API.get(`/company/leave/setup/holidays/${id}/`),
  update: (id, data) => API.put(`/company/leave/setup/holidays/${id}/`, data),
  patch: (id, data) => API.patch(`/company/leave/setup/holidays/${id}/`, data),
  delete: (id) => API.delete(`/company/leave/setup/holidays/${id}/`),
};
