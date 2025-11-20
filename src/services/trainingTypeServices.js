import API from './api';

export const trainingTypeAPI = {
  getAll: () => API.get('/company/training-types/'),
  getById: (id) => API.get(`/company/training-types/${id}/`),
  create: (data) => API.post('/company/training-types/', data),
  update: (id, data) => API.put(`/company/training-types/${id}/`, data),
  patch: (id, data) => API.patch(`/company/training-types/${id}/`, data),
  delete: (id) => API.delete(`/company/training-types/${id}/`),
};
