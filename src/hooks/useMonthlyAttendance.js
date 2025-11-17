import { useState, useEffect } from "react";
import { monthlyAttendanceAPI } from "../services/monthlyAttendanceServices";
import { message } from "antd";

export const useMonthlyAttendanceReport = () => {
  const [employees, setEmployees] = useState([]);
  const [report, setReport] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    employee_id: null,
    from_date: "",
    to_date: "",
  });

  const fetchEmployees = async () => {
    try {
      const res = await monthlyAttendanceAPI.getEmployees();
      setEmployees(res.data?.results || []);
    } catch {
      message.error("Failed to load employee list.");
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {
        employee_id: filters.employee_id || undefined,
        from_date: filters.from_date || undefined,
        to_date: filters.to_date || undefined,
      };

      const res = await monthlyAttendanceAPI.getMonthly(params);
      setReport(res.data?.attendance_list || []);
      setSummary(res.data?.summary || {});
    } catch {
      message.error("Failed to load monthly report.");
    }
    setLoading(false);
  };

  const handleFilter = () => {
    fetchReport();
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    report,
    summary,
    filters,
    setFilters,
    loading,
    handleFilter,
  };
};
