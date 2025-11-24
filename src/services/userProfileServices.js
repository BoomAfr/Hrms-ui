import API from './api';

export const userProfileAPI = {
  getProfile: () => API.get('profile/me/'),
};
