import API from "./api";

export const myLeaveReportAPI = {
  getMyLeave: (params) =>
    API.get("/company/leave/report/my-leave/", { params }),
};