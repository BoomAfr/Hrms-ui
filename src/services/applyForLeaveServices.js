
import API from "./api";


export const fetchLeaveBalance = async () => {
  const res = await API.get("/leave/apply/");
  return res.data;
};

export const getLeaveTypes = async () => {
  const res = await API.get("/company/leave/setup/leave-types/");
  return res.data;
};
export const getLeaveBalance = () =>
  API.get(`/company/leave/setup/leave-balance/`);

export const applyForLeave = async (payload) => {
  const res = await API.post("/company/leave/apply/", payload);
  return res.data;
};


export const fetchMyApplications = async (page = 1, pageSize = 10, search = "") => {
  const res = await API.get(`/company/leave/my-applications/?page=${page}&page_size=${pageSize}&search=${search}`);
  return res.data;
};
