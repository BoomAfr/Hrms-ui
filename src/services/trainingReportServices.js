import API from "./api";

export const trainingReportAPI = {
  getReport: (employeeId) => API.get("/company/employee-training-report/", {
    params: { employee: employeeId },
  }),
};

export const employeeAPI = {
  getAll: () => API.get("/company/employees/"),
};
