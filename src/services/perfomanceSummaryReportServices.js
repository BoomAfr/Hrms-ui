import API from "./api";

export const performanceSummaryAPI = {
  getAll: (params) => API.get("/company/performance-summary-report/", { params }),

  getEmployees: (params) => API.get("/company/employees/", { params }),
};