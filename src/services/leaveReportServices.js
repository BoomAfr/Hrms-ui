import API from "./api";

export const leaveReportAPI = {
  getEmployees: () => API.get("/company/employees/"),
  getReport: (params) => API.get("/company/leave/report/employee/", { params }),
};