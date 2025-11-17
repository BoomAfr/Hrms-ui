import { useState } from "react";
import { attendanceSummaryAPI } from "../services/attendanceSummaryReportServices";
import { message } from "antd";

/**
 * Hook: useAttendanceSummary
 * - fetches summary grid for given month (YYYY-MM)
 * - expects backend to return an array of objects where each object has:
 *   { "Employee Name": "...", "Designation": "...", "01": "P", "02":"A", ... , maybe other summary fields }
 */
export const useAttendanceSummary = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]); // array of row objects from API
  const [dayCols, setDayCols] = useState([]); // ['01','02',...]
  const [extraCols, setExtraCols] = useState([]); // non-day summary columns found at end
  const [monthStr, setMonthStr] = useState(""); // "YYYY-MM"

  const fetchSummary = async (month) => {
    if (!month) {
      message.error("Please select a month.");
      return;
    }

    setLoading(true);
    try {
      const res = await attendanceSummaryAPI.getSummary({ month });
      // backend returns an array (final_output in your view)
      const data = Array.isArray(res.data) ? res.data : [];

      setRows(data);

      if (data.length === 0) {
        setDayCols([]);
        setExtraCols([]);
        setMonthStr(month);
        setLoading(false);
        return;
      }

      // Determine columns: numeric two-digit day keys like '01', '02', etc.
      const sample = data[0];
      const keys = Object.keys(sample);

      // Keep ordering: Employee Name, Designation, then day columns (01..NN), then any other keys
      const dayKeys = keys.filter((k) => /^\d{2}$/.test(k)).sort((a, b) => a.localeCompare(b));
      const nonDayKeys = keys.filter((k) => !/^\d{2}$/.test(k));

      // Identify extra summary columns that are not Employee Name / Designation
      const extras = nonDayKeys.filter((k) => k !== "Employee Name" && k !== "Designation");

      setDayCols(dayKeys);
      setExtraCols(extras);
      setMonthStr(month);
    } catch (err) {
      console.error("Attendance summary fetch error:", err);
      message.error("Failed to fetch attendance summary");
      setRows([]);
      setDayCols([]);
      setExtraCols([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    rows,
    dayCols,
    extraCols,
    monthStr,
    fetchSummary,
  };
};