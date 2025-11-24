import API from "./api";

export const addRoleAPI = {
  getAll: (params) => API.get('/company/roles/', { params }),
  getAllActive: () => API.get('/company/roles/'),
  create: (data) => API.post('/company/roles/', data),
  getById: (id) => API.get(`/company/roles/${id}/`),
  update: (id, data) => API.put(`/company/roles/${id}/`, data),
  patch: (id, data) => API.patch(`/company/roles/${id}/`, data),
  delete: (id) => API.delete(`/company/roles/${id}/`),
};