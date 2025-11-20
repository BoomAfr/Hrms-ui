import API from "./api";

export const attendanceSummaryAPI = {
  getSummary: (params) =>
    API.get("/company/attendance/reports/summary/", { params }),
};
