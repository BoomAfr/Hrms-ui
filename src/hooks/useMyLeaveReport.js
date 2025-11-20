import { useState, useEffect } from "react";
import { myLeaveReportAPI } from "../services/myLeaveReportServices";
import { message } from "antd";

/**
 * Hook: useMyLeaveReport
 *
 * - Initializes employee_id from localStorage "user" if present (safe parse).
 * - Provides pagination (page, pageSize, total).
 * - fetches report data from /company/leave/report/my-leave/
 */
export const useMyLeaveReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Try to read current user from localStorage (safe)
  const getSavedUser = () => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  };

  const savedUser = getSavedUser();
  const initialEmployeeId = savedUser?.user_id ?? null;

  const [filters, setFilters] = useState({
    employee_id: initialEmployeeId,
    from_date: "",
    to_date: "",
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchReport = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const params = {
        employee_id: filters.employee_id ?? undefined,
        from_date: filters.from_date || undefined,
        to_date: filters.to_date || undefined,
        page,
        page_size: pageSize,
      };

      const res = await myLeaveReportAPI.getMyLeave(params);
      // Expecting server returns paginated object: { count, next, previous, results: [...] }
      setReportData(res.data?.results || []);
      setPagination((prev) => ({
        ...prev,
        total: res.data?.count || 0,
        current: page,
        pageSize,
      }));
    } catch (err) {
      console.error(err);
      message.error("Failed to load my leave report");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    // reset to first page when filtering
    fetchReport(1, pagination.pageSize);
  };

  const handlePageChange = (page, pageSize) => {
    fetchReport(page, pageSize);
  };

  useEffect(() => {
    // initial load
    fetchReport(1, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    reportData,
    loading,
    filters,
    setFilters,
    pagination,
    handleFilter,
    handlePageChange,
    savedUser, // expose in case page wants to display user info
  };
};