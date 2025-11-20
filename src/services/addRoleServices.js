import API from "./api";

export const addRoleAPI = {
  //false endpoints
  getAll: (params) => API.get('/company/addrole/', { params }),
  getAllActive: () => API.get('/company/addrole/'),
  create: (data) => API.post('/company/addrole/', data),
  getById: (id) => API.get(`/company/addrole/${id}/`),
  update: (id, data) => API.put(`/company/addrole/${id}/`, data),
  patch: (id, data) => API.patch(`/company/addrole/${id}/`, data),
  delete: (id) => API.delete(`/company/addrole/${id}/`),
};