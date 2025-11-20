import API from "./api";

export const leaveSummaryReportAPI = {
  getEmployees: () => API.get("/company/employees/"),
  getSummary: (params) => API.get("/company/leave/report/summary/", { params }),
};