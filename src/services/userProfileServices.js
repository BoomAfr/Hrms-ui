import API from './api';

export const userProfileAPI = {
  getProfile: () => API.get('profile/me/'),
  updateProfile: (data) => API.patch('profile/me/', data),
};

