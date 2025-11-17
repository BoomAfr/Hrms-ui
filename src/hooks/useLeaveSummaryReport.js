import { useState, useEffect } from "react";
import {leaveSummaryReportAPI} from "../services/leaveSummaryReportServices";
import { message } from "antd";

export const useLeaveSummaryReport = () => {
  const [employees, setEmployees] = useState([]);
  const [summary, setSummary] = useState([]);

  const [filters, setFilters] = useState({
    employee_id: null,
    from_date: "",
    to_date: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch employee list
  const fetchEmployees = async () => {
    try {
      const res = await leaveSummaryReportAPI.getEmployees();
      setEmployees(res.data?.results || []);
    } catch (err) {
      message.error("Failed to load employee list");
    }
  };

  // Fetch summary report
  const fetchSummary = async () => {
    setLoading(true);
    try {
      const params = {
        employee_id: filters.employee_id || undefined,
        from_date: filters.from_date || undefined,
        to_date: filters.to_date || undefined,
      };

      const res = await leaveSummaryReportAPI.getSummary(params);
      setSummary(res.data?.results || []);
    } catch (err) {
      message.error("Failed to load summary report");
    }
    setLoading(false);
  };

  const handleFilter = () => {
    fetchSummary();
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    summary,
    filters,
    setFilters,
    loading,
    handleFilter,
  };
};