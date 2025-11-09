import API from './api';

export const publicHolidayAPI = {
  getAll: () => API.get('/company/leave/setup/public-holidays/'),
  create: (data) => API.post('/company/leave/setup/public-holidays/', data),
  getById: (id) => API.get(`/company/leave/setup/public-holidays/${id}/`),
  update: (id, data) => API.put(`/company/leave/setup/public-holidays/${id}/`, data),
  patch: (id, data) => API.patch(`/company/leave/setup/public-holidays/${id}/`, data),
  delete: (id) => API.delete(`/company/leave/setup/public-holidays/${id}/`),
};