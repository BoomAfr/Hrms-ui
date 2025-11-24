/*import API from './api';
export const LateConfigurationAPI = {
  getAll: (page = 1, pageSize = 10, search = '') =>
    API.get(`/company/payroll/hourly-paygrades/?page=${page}&page_size=${pageSize}&search=${search}`),
  getAllActive: () => API.get('/company/payroll/hourly-paygrades/'),

  create: (data) => API.post('/company/payroll/hourly-paygrades/', data),
  getById: (id) => API.get(`/company/payroll/hourly-paygrades/${id}/`),
  update: (id, data) => API.put(`/company/payroll/hourly-paygrades/${id}/`, data),
  patch: (id, data) => API.patch(`/company/payroll/hourly-paygrades/${id}/`, data),
  delete: (id) => API.delete(`/company/payroll/hourly-paygrades/${id}/`),
};*/
import API from "../../services/api";

export const lateConfigurationAPI = {
  getAll: (params) => API.get("/company/setup/late-configuration/", { params }),

  create: (data) =>
    API.post("/company/setup/late-configuration/", data),

  update: (id, data) =>
    API.put(`/company/setup/late-configuration/${id}/`, data),

  delete: (id) =>
    API.delete(`/company/setup/late-configuration/${id}/`),
};


