import API from './api';

export const weeklyHolidayAPI = {
  getAll: () => API.get('/company/leave/setup/weekly-holidays/'),
  create: (data) => API.post('/company/leave/setup/weekly-holidays/', data),
  getById: (id) => API.get(`/company/leave/setup/weekly-holidays/${id}/`),
  update: (id, data) => API.put(`/company/leave/setup/weekly-holidays/${id}/`, data),
  patch: (id, data) => API.patch(`/company/leave/setup/weekly-holidays/${id}/`, data),
  delete: (id) => API.delete(`/company/leave/setup/weekly-holidays/${id}/`),
};