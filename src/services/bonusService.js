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

export default {
  getBonusSettings,
  generateBonus,
  getEmployeeBonuses,
};
