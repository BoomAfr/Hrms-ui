import api from './api';

export const getBonusSettings = async () => {
  const response = await api.get('/company/bonus-settings/');
  return response.data;
};

export const generateBonus = async (data) => {
  const response = await api.post('/company/bonus/generate/', data);
  return response.data;
};

export const getEmployeeBonuses = async (params = {}) => {
  const response = await api.get('/company/employee-bonuses/', { params });
  return response.data;
};

export const markBonusPaid = async (data, exportCSV = false) => {
  const config = {};
  if (exportCSV) {
    config.params = { export: 'csv' };
    config.responseType = 'blob'; // Important for file download
  }
  const response = await api.post('/company/payments/mark-paid/', data, config);
  // Return the entire response if it's a blob, otherwise return data
  return exportCSV ? response : response.data;
};

export default {
  getBonusSettings,
  generateBonus,
  getEmployeeBonuses,
  markBonusPaid,
};
