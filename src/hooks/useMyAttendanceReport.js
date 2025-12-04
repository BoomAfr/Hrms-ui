import { useState } from "react";
import { message } from "antd";
import { myAttendanceAPI } from "../services/myAttendanceReportServices";

export const useMyAttendanceReport = () => {
  const [report, setReport] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
  });

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {
        from_date: filters.from_date || undefined,
        to_date: filters.to_date || undefined,
      };

      const res = await myAttendanceAPI.getMyReport(params);

      setReport(res.data?.daily_records || []);
      setSummary(res.data?.summary || {});
      
    } catch {
      message.error("Failed to load attendance report.");
    }
    setLoading(false);
  };

  const handleFilter = () => {
    fetchReport();
  };

  return {
    report,
    summary,
    filters,
    setFilters,
    loading,
    handleFilter,
  };
};