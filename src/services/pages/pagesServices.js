import API from "../api";

export const pagesServicesAPI = {
  getAll: () =>API.get(`/pages/`),
  updateRolePermission:(roleId,selectedPages)=>API.post(`/roles/${roleId}/pages/`,selectedPages),
  getByRole:(roldId)=>API.get(`/roles/${roldId}/pages/`)
};

