import API from "./api";

export const jobPostAPI = {
  getAll: (params) => API.get("/company/job-posts/", { params }),
  getById: (id) => API.get(`/company/job-posts/${id}/`),
  create: (data) => API.post("/company/job-posts/", data),
  update: (id, data) => API.put(`/company/job-posts/${id}/`, data),
  delete: (id) => API.delete(`/company/job-posts/${id}/`),
};