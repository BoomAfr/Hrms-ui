import API from './api';

export const earnLeaveAPI = {
  // list all rules
  getAll: () => API.get('/company/leave/setup/earn-leave-rule/'),
  // get single rule
  getById: (id) => API.get(`/company/leave/setup/earn-leave-rule/${id}/`),
  // patch (partial update)
  put: (id, data) => API.put(`/company/leave/setup/earn-leave-rule/`, data),
};
