import { useState, useEffect } from "react";
import { monthlyAttendanceAPI } from "../services/monthlyAttendanceServices";
import { message } from "antd";
import dayjs from "dayjs";

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
    } catch (err) {
      console.error("fetchEmployees error:", err);
      message.error("Failed to load employee list.");
    }
  };

  const fetchReport = async () => {
    if (!filters.employee_id) {
      message.warning("Please select an employee first.");
      return;
    }

    setLoading(true);
    try {
      const params = {
        employee_id: filters.employee_id || undefined,
        from_date: filters.from_date || undefined,
        to_date: filters.to_date || undefined,
      };

      const res = await monthlyAttendanceAPI.getMonthly(params);

      const rawList = res.data?.daily_records || [];

      const normalized = (rawList || []).map((r) => {
        const get = (keys) => {
          for (const k of keys) {
            if (r[k] !== undefined && r[k] !== null) return r[k];
          }
          return null;
        };

        const dateVal = get(["Date", "date", "attendance_date"]);
        const inTime = get(["In Time", "InTime", "in_time", "punch_in_time"]);
        const outTime = get(["Out Time", "OutTime", "out_time", "punch_out_time"]);
        const workingTime = get(["Working Time", "WorkingTime", "working_time", "total_work_duration"]);
        const late = get(["Late", "late", "is_late"]);
        const lateTime = get(["Late Time", "LateTime", "late_time", "late_duration"]);
        const overTime = get(["Over Time", "OverTime", "over_time", "overtime_duration"]);
        const status = get(["Status", "status"]);

        const dateStr =
          dateVal && dayjs(dateVal).isValid() ? dayjs(dateVal).format("YYYY-MM-DD") : (dateVal ?? "-");

        return {
          date: dateStr,
          in_time: inTime ?? "--",
          out_time: outTime ?? "--",
          working_time: workingTime ?? (typeof workingTime === "number" ? String(workingTime) : "--"),
          late: (typeof late === "boolean") ? (late ? "Yes" : "No") : (late ?? "-"),
          late_time: lateTime ?? "00:00",
          over_time: overTime ?? "00:00",
          status: status ?? "-",
          __raw: r,
        };
      });

      setReport(normalized);
      setSummary(res.data?.summary || {});
    } catch (err) {
      console.error("fetchReport error:", err);
      message.error("Failed to load monthly report.");
    } finally {
      setLoading(false);
    }
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
