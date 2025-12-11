import API from './api';

export const experienceAPI = {
  create: (employeeId, data) => API.post(`/company/employees/${employeeId}/experience/`, data),
  getById: (employeeId) => API.get(`/company/employees/${employeeId}/experience/`),
  update: (employeeId, expId, data) => API.put(`/company/employees/${employeeId}/experience/${expId}/`, data),
  patch: (employeeId, expId, data) => API.patch(`/company/employees/${employeeId}/experience/${expId}/`, data),
  delete: (employeeId, expId) => API.delete(`/company/employees/${employeeId}/experience/${expId}/`),
};
