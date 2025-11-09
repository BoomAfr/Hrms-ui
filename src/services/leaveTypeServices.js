import API from './api';

export const leaveTypeAPI = {
  getAll: () => API.get('/company/leave/setup/leave-types/'),
  create: (data) => API.post('/company/leave/setup/leave-types/', data),
  getById: (id) => API.get(`/company/leave/setup/leave-types/${id}/`),
  update: (id, data) => API.put(`/company/leave/setup/leave-types/${id}/`, data),
  patch: (id, data) => API.patch(`/company/leave/setup/leave-types/${id}/`, data),
  delete: (id) => API.delete(`/company/leave/setup/leave-types/${id}/`),
};