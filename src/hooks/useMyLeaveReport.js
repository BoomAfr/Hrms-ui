import { useState } from "react";
import { useSelector } from "react-redux";
import { myLeaveReportAPI } from "../services/myLeaveReportServices";
import { message } from "antd";

export const useMyLeaveReport = () => {
  const { user: reduxUser } = useSelector((state) => state.auth);

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);

  const savedUser = reduxUser || (() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  })();

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
      setReportData(res.data || []);
      setPagination((prev) => ({
        ...prev,
        total: res.data?.length || 0,
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
    setFilterApplied(true); 
    fetchReport(1, pagination.pageSize);
  };

  const handlePageChange = (page, pageSize) => {
    fetchReport(page, pageSize);
  };

  return {
    reportData,
    loading,
    filters,
    setFilters,
    pagination,
    handleFilter,
    handlePageChange,
    savedUser,
    filterApplied, 
  };
};
