import { useState, useEffect, useMemo } from "react";
import { dailyAttendanceAPI } from "../services/dailyAttendanceServices";
import { message } from "antd";
import dayjs from "dayjs";

export const useDailyAttendance = () => {
  // default date = today (YYYY-MM-DD)
  const todayStr = dayjs().format("YYYY-MM-DD");

  const [date, setDate] = useState(todayStr);
  const [loading, setLoading] = useState(false);

  // raw rows fetched from API (array)
  const [rows, setRows] = useState([]);

  // pagination (if backend supports it)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 1000, // default large page size (no pagination UI requested)
    total: 0,
  });

  const fetchDaily = async (fetchPage = pagination.current, fetchPageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const params = {
        target_date: date || undefined,
        page: fetchPage,
        page_size: fetchPageSize,
      };

      const res = await dailyAttendanceAPI.getDaily(params);

      // handle multiple possible response shapes
      let dataArray = [];

      if (!res || !res.data) {
        dataArray = [];
      } else if (Array.isArray(res.data)) {
        // direct array response
        dataArray = res.data;
      } else if (Array.isArray(res.data.results)) {
        // DRF-style paginated results
        dataArray = res.data.results;
        setPagination((prev) => ({
          ...prev,
          total: res.data.count ?? (res.data.results.length || 0),
          current: fetchPage,
          pageSize: fetchPageSize,
        }));
      } else if (Array.isArray(res.data.data)) {
        dataArray = res.data.data;
      } else {
        // maybe nested object with department grouping already
        // try to detect { departments: [ { department: 'X', attendance: [...] } ] }
        if (Array.isArray(res.data.departments)) {
          // flatten department-attendance to array of records with department included
          dataArray = res.data.departments.flatMap((d) =>
            (d.attendance || []).map((r) => ({ ...r, department: d.department || d.name }))
          );
        } else {
          // unknown shape but try to coerce to an array if it's an object with results-like key
          dataArray = Array.isArray(res.data.results) ? res.data.results : [];
        }
      }

      setRows(dataArray || []);
    } catch (err) {
      console.error("Daily attendance fetch error:", err);
      message.error("Failed to fetch daily attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    // reset to first page
    fetchDaily(1, pagination.pageSize);
  };

  const handlePageChange = (page, pageSize) => {
    fetchDaily(page, pageSize);
  };

  useEffect(() => {
    // initial fetch
    fetchDaily(1, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  // Group rows by department for rendering
  const groupedByDept = useMemo(() => {
    const groups = {};
    (rows || []).forEach((r) => {
      const dept = r.department || r.department_name || r.department_title || "Unassigned";
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(r);
    });

    // maintain insertion order
    return groups;
  }, [rows]);

  return {
    date,
    setDate,
    loading,
    rows,
    groupedByDept,
    pagination,
    handleFilter,
    handlePageChange,
    fetchDaily, // exposed if you want to call directly
  };
};