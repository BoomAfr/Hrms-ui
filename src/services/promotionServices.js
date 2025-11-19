import API from './api';

export const promotionAPI = {
  getAll: (params) => API.get('/company/promotions/', { params }),
  create: (payload) => API.post('/company/promotions/', payload),
  update: (id, data) => API.put(`/company/promotions/${id}/`, data),
  delete: (id) => API.delete(`/company/promotions/${id}/`),
};

export const departmentAPI = {
  getAll: () => API.get('/company/departments/'),
};

export const designationAPI = {
  getAll: () => API.get('/company/designations/'),
};

export const paygradeAPI = {
  getAll: () => API.get('/company/payroll/monthly/paygrades/'),
};
