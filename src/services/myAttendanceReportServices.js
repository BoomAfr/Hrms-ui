import API from "./api";

export const myAttendanceAPI = {
  getMyReport: (params) =>
    API.get("/company/attendance/reports/my/", { params }),
};