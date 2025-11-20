import API from './api';

export const changePasswordAPI = {
  changePassword: (data) => API.post('/company/change-password/', data)
};
