import API from "../services/api";

export const manualAttendanceServices = {
  getManualAttendance: (params) => API.get("/company/attendance/manual/", { params }),

  patchAttendance: (data) => API.patch("/company/attendance/manual/", data),

  uploadCSV: (formData) => API.patch("/company/attendance/upload-csv/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
};