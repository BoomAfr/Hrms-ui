
import { useState } from "react";
import { fetchLeaveBalance, applyForLeave, fetchMyApplications } from "../services/applyForLeaveServices";

export const useApplyLeave = () => {
  const [applications, setApplications] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Fetch My Applications
  const fetchMyApplicationsHandler = async (page = 1, pageSize = 10, search = "") => {
    setLoading(true);
    try {
      const data = await fetchMyApplications(page, pageSize, search);
      setApplications(data.results || []);
      setPagination({
        count: data.count,
        current: page,
        pageSize,
      });
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Leave Balance
  const fetchLeaveBalanceHandler = async () => {
    try {
      const data = await fetchLeaveBalance();
      setLeaveBalance(data.available_leaves || []);
    } catch (err) {
      console.error("Failed to fetch leave balance:", err);
    }
  };

  // ✅ Apply for leave
  const applyForLeaveHandler = async (payload) => {
    await applyForLeave(payload);
  };

  return {
    applications,
    leaveBalance,
    pagination,
    loading,
    fetchMyApplications: fetchMyApplicationsHandler,
    fetchLeaveBalance: fetchLeaveBalanceHandler,
    applyForLeave: applyForLeaveHandler,
  };
};
