// src/services/Payroll/salarySheetServices.js
import API from "../api";

export const salarySheetAPI = {
  list: (params) => API.get("/company/sheet/list/", { params }),

  generatePayslip: (payload) =>
    API.post("/company/payslip/generate/", payload),

  retrievePayslip: (id) => API.get(`/company/payslip/${id}/`),
};
