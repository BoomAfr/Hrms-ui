import API from "./api";

export const employeeTrainingAPI = {
  getAll: (params = {}) => API.get("/company/employee-trainings/", { params }),

  getById: (id) => API.get(`/company/employee-trainings/${id}/`),

  create: (formData) =>
    API.post("/company/employee-trainings/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id, formData) =>
    API.put(`/company/employee-trainings/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  delete: (id) => API.delete(`/company/employee-trainings/${id}/`),
};

export const trainingTypeAPI = {
  getAll: () => API.get("/company/training-types/"),
};

export const employeeAPI = {

  getAll: (params = {}) => API.get("/company/employees/", { params }),
};
