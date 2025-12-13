import api from './api';
// Get monthly salary sheets (list of employees with status)
export const getSalarySheets = async (params = {}) => {
  const response = await api.get('/company/sheet/list/', { params });
  return response.data;
};

// Generate single payslip
export const generateSinglePayslip = async (data) => {
  const response = await api.post('/company/payslip/generate/', data);
  return response.data;
};

// Generate bulk payslips
export const generateBulkPayslips = async (data) => {
  const response = await api.post('/company/payslip/generate-bulk/', data);
  return response.data;
};

// Get single payslip details
export const getPayslip = async (id) => {
  const response = await api.get(`/company/payslip/${id}/`);
  return response.data;
};

// Mark payment as paid (optional, based on your backend view but not explicitly requested for these pages yet)
export const markPaymentPaid = async (data) => {
  const response = await api.post('/company/payments/mark-paid/', data);
  return response.data;
};

export default {
  getSalarySheets,
  generateSinglePayslip,
  generateBulkPayslips,
  getPayslip,
  markPaymentPaid
};
