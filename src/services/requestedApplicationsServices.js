import API from "./api";

export const getAllLeaveRequests = async (params) => {
  const res = await API.get("/company/admin/leave/all-requests/", { params });
  return res.data;
};

export const approveRejectLeave = async (id, action, rejection_reason = "") => {
  const res = await API.patch(`/company/admin/leave/approve-reject/${id}/`, {
    action,
    rejection_reason,
  });
  return res.data;
};