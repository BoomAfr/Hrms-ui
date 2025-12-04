import API from "./api";

export const employeePermanentAPI = {
  getEmployees: (params) => API.get("/company/employees/", { params }),

  getDepartments: (params) => API.get("/company/departments/", { params }),
  getDesignations: (params) => API.get("/company/designations/", { params }),
  getRoles: (params) => API.get("/company/roles/", { params }),

  updateJobStatus: (id, payload) =>
    API.patch(`/company/employees/${id}/update-status/`, payload),
};