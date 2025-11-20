import { useState } from "react";
import { message } from "antd";
import { manualAttendanceServices } from "../services/manualAttendanceServices";
import { departmentAPI } from "../services/departmentServices";

export function useManualAttendance() {
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const [attendanceRows, setAttendanceRows] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  const fetchDepartments = async () => {
    setLoadingDepartments(true);
    try {
      const res = await departmentAPI.getAll({ page: 1, page_size: 1000 });
      console.log("DEPT RES:", res.data);
      setDepartments(res.data.results || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load departments");
    } finally {
      setLoadingDepartments(false);
    }
  };

  const fetchAttendance = async (params) => {
    // params: { department_id, target_date }
    setLoadingAttendance(true);
    try {
      const res = await manualAttendanceServices.getManualAttendance(params);
      // backend returns array as your Django view builds
      const rows = (res.data || []).map((r) => ({
        employee_id: r.employee_id,
        fingerprint_no: r.fingerprint_no,
        employee_name: r.employee_name,
        punch_in_time: r.punch_in_time, // 'HH:mm:ss' or null
        punch_out_time: r.punch_out_time,
        is_present: r.is_present,
        late_time: r.late_time,
        overtime: r.overtime,
        status: r.status,
      }));

      setAttendanceRows(rows);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch attendance");
    } finally {
      setLoadingAttendance(false);
    }
  };

  const updateRowLocal = (employee_id, key, value) => {
    setAttendanceRows((prev) => prev.map((r) => (r.employee_id === employee_id ? { ...r, [key]: value } : r)));
  };

  // Save all rows by calling PATCH per employee sequentially.
  // You can change to Promise.all for concurrency if you prefer.
  const saveAttendanceBatch = async (payloadArray) => {
    try {
      for (const item of payloadArray) {
        // backend expects employee_id, target_date, punch_in_time, punch_out_time
        await manualAttendanceServices.patchAttendance(item);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    departments,
    loadingDepartments,
    fetchDepartments,
    attendanceRows,
    loadingAttendance,
    fetchAttendance,
    updateRowLocal,
    saveAttendanceBatch,
  };
}