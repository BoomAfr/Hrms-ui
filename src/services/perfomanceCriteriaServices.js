import API from "./api";

export const performanceCriteriaAPI = {
  getAll: (params) => API.get("/company/performance-criteria/", { params }),
  create: (data) => API.post("/company/performance-criteria/", data),
  update: (id, data) => API.put(`/company/performance-criteria/${id}/`, data),
  delete: (id) => API.delete(`/company/performance-criteria/${id}/`),
};
