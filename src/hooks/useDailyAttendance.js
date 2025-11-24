import { useState, useEffect, useMemo } from "react";
import { dailyAttendanceAPI } from "../services/dailyAttendanceServices";
import { message } from "antd";
import dayjs from "dayjs";

export const useDailyAttendance = () => {
  const todayStr = dayjs().format("YYYY-MM-DD");

  const [date, setDate] = useState(todayStr);
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState([]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 1000,
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

      let dataArray = [];

      if (res?.data && Array.isArray(res.data)) {
        // Map API response to expected structure
        dataArray = res.data.map((r) => ({
          date: r["Date"],
          employee_name: r["Employee Name"],
          in_time: r["In Time"],
          out_time: r["Out Time"],
          working_time: r["Working Time"],
          late: r["Late"] === "Yes", // convert to boolean
          late_time: r["Late Time"],
          over_time: r["Over Time"],
          department: r["Designation"] || "Unassigned", // use Designation as department
          id: r["Employee ID"], // optional key
        }));
        setPagination((prev) => ({
          ...prev,
          total: dataArray.length,
          current: fetchPage,
          pageSize: fetchPageSize,
        }));
      } else {
        dataArray = [];
      }

      setRows(dataArray);
    } catch (err) {
      console.error("Daily attendance fetch error:", err);
      message.error("Failed to fetch daily attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchDaily(1, pagination.pageSize);
  };

  const handlePageChange = (page, pageSize) => {
    fetchDaily(page, pageSize);
  };

  useEffect(() => {
    fetchDaily(1, pagination.pageSize);
  }, [date]);

  const groupedByDept = useMemo(() => {
    const groups = {};
    (rows || []).forEach((r) => {
      const dept = r.department || "Unassigned";
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(r);
    });
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
    fetchDaily,
  };
};
