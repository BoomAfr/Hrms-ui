import API from './api';

export const educationAPI = {
  create: (id, data) => API.post(`/company/employees/${id}/education/`, data),
  getById: (id) => API.get(`/company/employees/${id}/education/`),
  update: (id, eduId, data) => API.put(`/company/employees/${id}/education/${eduId}/`, data),
  patch: (id, eduId, data) => API.patch(`/company/employees/${id}/education/${eduId}/`, data),
  delete: (id, eduId) => API.delete(`/company/employees/${id}/education/${eduId}/`),
};
