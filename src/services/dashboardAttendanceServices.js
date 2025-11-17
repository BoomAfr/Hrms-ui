import API from "./api";

export const dashboardAttendanceAPI = {
  getSettings: () => API.get("/company/dashboard-data/"),
  updateSettings: (data) =>
    API.post("/company/dashboard-data/", data),
};