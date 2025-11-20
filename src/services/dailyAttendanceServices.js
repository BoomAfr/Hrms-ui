import API from "./api";

export const dailyAttendanceAPI = {
  getDaily: (params) => API.get("/company/attendance/reports/daily/", { params }),
};