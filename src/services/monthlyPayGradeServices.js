import API from "./api";

export const monthlyPayGradeAPI = {
  getAll: () => API.get("/company/payroll/monthly/paygrades/"),
  getById: (id) => API.get(`/company/payroll/monthly/paygrades/${id}/`),
  create: (data) => API.post("/company/payroll/monthly/paygrades/", data),
  update: (id, data) => API.put(`/company/payroll/monthly/paygrades/${id}/`, data),
  delete: (id) => API.delete(`/company/payroll/monthly/paygrades/${id}/`),
};
