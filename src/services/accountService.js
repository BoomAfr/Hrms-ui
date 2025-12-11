import API from './api';

export const accountAPI = {
  create: (employeeId, data) => API.post(`/company/employees/${employeeId}/account-details/`, data),
  getById: (employeeId) => API.get(`/company/employees/${employeeId}/account-details/`),
  update: (employeeId, accountId, data) => API.put(`/company/employees/${employeeId}/account-details/${accountId}/`, data),
  patch: (employeeId, accountId, data) => API.patch(`/company/employees/${employeeId}/account-details/${accountId}/`, data),
  delete: (employeeId, accountId) => API.delete(`/company/employees/${employeeId}/account-details/${accountId}/`),
};
