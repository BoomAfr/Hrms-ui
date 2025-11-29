import api from "./api";

export const getEmployees = async (params = {}) => {
  const res = await api.get("/company/employees/", { params });
  return res.data.results;
};

export const getPerformanceCategories = async () => {
  const res = await api.get("/company/performance-categories/");
  return res.data.results;
};

export const getPerformanceCriteria = async () => {
  const res = await api.get("/company/performance-criteria/");
  return res.data.results;
};

export const getEmployeePerformanceList = async (search = "", page = 1, pageSize) => {
  const params = {};
  if (search) params.search = search;
  if (page) params.page = page;
  if (pageSize) params.page_size = pageSize;
  return api.get("/company/employee-performance/", { params });
};

export const getEmployeePerformanceDetail = async (id) => {
  return api.get(`/company/employee-performance/${id}/`);
};

export const createEmployeePerformance = async (payload) => {
  return api.post("/company/employee-performance/", payload);
};

export const updateEmployeePerformance = async (id, payload) => {
  return api.put(`/company/employee-performance/${id}/`, payload);
};

export const deleteEmployeePerformance = async (id) => {
  return api.delete(`/company/employee-performance/${id}/`);
};
