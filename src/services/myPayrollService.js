import API from './api';

export const myPayrollAPI = {
  getMyPayroll: (params) => API.get('/company/my-payroll/', { params }),
};
