import API from "../api";

export const allowanceAPI = {
  list: (params) => API.get("/company/payroll/allowances/", { params }),
  create: (data) => API.post("/company/payroll/allowances/", data),
  retrieve: (id) => API.get(`/company/payroll/allowances/${id}/`),
  update: (id, data) => API.put(`/company/payroll/allowances/${id}/`, data),
  partialUpdate: (id, data) => API.patch(`/company/payroll/allowances/${id}/`, data),
  delete: (id) => API.delete(`/company/payroll/allowances/${id}/`),
};