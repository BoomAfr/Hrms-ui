import API from "./api";

export const monthlyPayGradeAPI = {
  getAll: (params) => API.get("/company/payroll/monthly/paygrades/", { params }),
  getById: (id) => API.get(`/company/payroll/monthly/paygrades/${id}/`),
  create: (data) => API.post("/company/payroll/monthly/paygrades/", data),
  update: (id, data) => API.put(`/company/payroll/monthly/paygrades/${id}/`, data),
  delete: (id) => API.delete(`/company/payroll/monthly/paygrades/${id}/`),
};
