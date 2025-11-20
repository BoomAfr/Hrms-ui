import API from "../services/api"; // your axios instance

export const manualAttendanceServices = {
  getManualAttendance: (params) => API.get("/company/attendance/manual/", { params }),

  patchAttendance: (data) => API.patch("/company/attendance/manual/", data),
  //csv/
  // CSV upload POST -> /attendance/manual/csv/
  uploadCSV: (formData) => API.patch("/company/attendance/manual/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
};