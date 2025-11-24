import API from "../api";

export const deductionAPI = {
  list: (params) => API.get("/company/payroll/deductions/", { params }),
  create: (data) => API.post("/company/payroll/deductions/", data),
  retrieve: (id) => API.get(`/company/payroll/deductions/${id}/`),
  update: (id, data) => API.put(`/company/payroll/deductions/${id}/`, data),
  partialUpdate: (id, data) => API.patch(`/company/payroll/deductions/${id}/`, data),
  delete: (id) => API.delete(`/company/payroll/deductions/${id}/`),
};
