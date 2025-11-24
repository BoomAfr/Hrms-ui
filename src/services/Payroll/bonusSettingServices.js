import API from '../api';

export const bonusSettingAPI = {
  getAll: () => API.get('/dummy/bonus/'), 
  create: (data) => API.post('/dummy/bonus/', data),
  update: (id, data) => API.put(`/dummy/bonus/${id}/`, data),
  delete: (id) => API.delete(`/dummy/bonus/${id}/`),
};
