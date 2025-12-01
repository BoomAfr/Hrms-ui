import API from '../api';

export const bonusSettingAPI = {
  getAll: () => API.get(`/company/bonus-settings/`),

  create: (data) => API.post('/company/bonus-settings/', data),

  update: (id, data) => API.put(`/company/bonus-settings/${id}/`, data),

  delete: (id) => API.delete(`/company/bonus-settings/${id}/`),
};
