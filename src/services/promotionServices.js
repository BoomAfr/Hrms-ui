import API from './api';

export const promotionApi = {
  getAll: (params = {}) => API.get('/company/promotions/', { params }),
  getById: (id) => API.get(`/company/promotions/${id}/`),
  create: (payload) => API.post('/company/promotions/', payload),
  update: (id, payload) => API.put(`/company/promotions/${id}/`, payload),
  delete: (id) => API.delete(`/company/promotions/${id}/`),
};

export const manageEmployeeApi = {
  getAll: (params = {}) => API.get('/company/employees/', { params }),
  getById: (id) => API.get(`/company/employees/${id}/`),
};

export const departmentApi = {
  getAll: (params = {}) => API.get('/company/departments/', { params }),
};

export const designationApi = {
  getAll: (params = {}) => API.get('/company/designations/', { params }),
};

export const paygradeApi = {
  getAll: (params = {}) => API.get('/company/payroll/monthly/paygrades/', { params }),
  getById: (id) => API.get(`/company/payroll/monthly/paygrades/${id}/`),
};
