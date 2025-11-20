import API from "./api";

export const monthlyAttendanceAPI = {
  getEmployees: () =>API.get("/company/employees/"),
  getMonthly: (params) =>
    API.get("/company/attendance/reports/monthly/", { params }),
};