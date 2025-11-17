import API from "./api";

export const attendanceSummaryAPI = {
  // GET /api/company/attendance/reports/summary/?month=YYYY-MM
  getSummary: (params) =>
    API.get("/company/attendance/reports/summary/", { params }),
};
