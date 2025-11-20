import API from './api';

export const noticeAPI = {
  getAll: () => API.get('/company/notices/'),
  getById: (id) => API.get(`/company/notices/${id}/`),
  create: (data) =>
    API.post('/company/notices/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, data) =>
    API.put(`/company/notices/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => API.delete(`/company/notices/${id}/`),
};
