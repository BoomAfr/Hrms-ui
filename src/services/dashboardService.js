import API from './api';

export const dashboardAPI = {
  getAll: () => API.get('/company/dashboard-data/'),
};
