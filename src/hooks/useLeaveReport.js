import { useState, useEffect } from "react";
import { leaveReportAPI } from "../services/leaveReportServices";
import { message } from "antd";

export const useLeaveReport = () => {
  const [employees, setEmployees] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [filters, setFilters] = useState({
    employee_id: null,
    from_date: "",
    to_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch employee list
  const fetchEmployees = async () => {
    try {
      const res = await leaveReportAPI.getEmployees();
      setEmployees(res.data.results || []);
      console.log("EMPLOYEE API:", res.data);
    } catch (err) {
      message.error("Failed to load employee list");
    }
  };

  // Fetch report data with filters + pagination
  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {
        employee: filters.employee_id || undefined,
        from_date: filters.from_date || undefined,
        to_date: filters.to_date || undefined,
        page: pagination.current,
        page_size: pagination.pageSize,
      };

      const res = await leaveReportAPI.getReport(params);

      setReportData(res.data?.results || []);
      setPagination((prev) => ({
        ...prev,
        total: res.data?.count || 0,
      }));
    } catch (err) {
      message.error("Failed to load leave report");
    }
    setLoading(false);
  };

  const handleFilter = () => {
    setPagination({ ...pagination, current: 1 });
    fetchReport();
  };

  const handlePageChange = (page, pageSize) => {
    setPagination({ ...pagination, current: page, pageSize });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [pagination.current, pagination.pageSize]);

  return {
    employees,
    reportData,
    filters,
    setFilters,
    loading,
    pagination,
    handleFilter,
    handlePageChange,
  };
};