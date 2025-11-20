import API from "./api";

export const employeeTrainingAPI = {
  getAll: () => API.get("/company/employee-trainings/"),
  getById: (id) => API.get(`/company/employee-trainings/${id}/`),
  create: (data) => API.post("/company/employee-trainings/", data),
  update: (id, data) => API.put(`/company/employee-trainings/${id}/`, data),
  delete: (id) => API.delete(`/company/employee-trainings/${id}/`),
};

export const trainingTypeAPI = {
  getAll: () => API.get("/company/training-types/"),
};

export const employeeAPI = {
  getAll: () => API.get("/company/employees/"),
};
