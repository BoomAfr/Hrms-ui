import API from './api';

export const authAPI = {
  login: (credentials) => API.post('/login/', credentials),
  logout: () => API.post('/logout/'),
  departmentList : () => API.get('/company/departments/')
  
};