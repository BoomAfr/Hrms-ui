import API from "./api";

export const workShiftAPI = {
  getAll: () => API.get("/company/attendance/setup/shifts/"),
  getAllActive: () => API.get("/company/attendance/setup/shifts/"),
  getById: (id) => API.get(`/company/attendance/setup/shifts/${id}/`),
  create: (data) => API.post("/company/attendance/setup/shifts/", data),
  update: (id, data) => API.put(`/company/attendance/setup/shifts/${id}/`, data),
  delete: (id) => API.delete(`/company/attendance/setup/shifts/${id}/`),
};
