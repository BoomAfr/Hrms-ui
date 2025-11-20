import { useState, useEffect } from "react";
import { dashboardAttendanceAPI } from "../services/dashboardAttendanceServices";
import { message } from "antd";

export const useDashboardAttendance = () => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    attendance_status: "yes",   // yes | no
    ip_check: "any",           // any | whitelist_only
    whitelisted_ips: [""],     // array of IP strings
  });

  // Fetch existing settings
  const fetchSettings = async () => {
    try {
      const res = await dashboardAttendanceAPI.getSettings();
      if (res.data) {
        setForm({
          attendance_status: res.data.attendance_status || "yes",
          ip_check: res.data.ip_check || "any",
          whitelisted_ips: res.data.whitelisted_ips?.length
            ? res.data.whitelisted_ips
            : [""],
        });
      }
    } catch (err) {
      message.error("Failed to load dashboard settings");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Add new IP field
  const addIP = () => {
    setForm({ ...form, whitelisted_ips: [...form.whitelisted_ips, ""] });
  };

  // Remove IP by index
  const removeIP = (index) => {
    const updated = form.whitelisted_ips.filter((_, i) => i !== index);
    setForm({ ...form, whitelisted_ips: updated.length ? updated : [""] });
  };

  // Update IP value
  const updateIP = (index, value) => {
    const updated = [...form.whitelisted_ips];
    updated[index] = value;
    setForm({ ...form, whitelisted_ips: updated });
  };

  // Save settings
  const updateSettings = async () => {
    setLoading(true);
    try {
      await dashboardAttendanceAPI.updateSettings(form);
      message.success("Attendance settings updated successfully");
    } catch (err) {
      message.error("Failed to update settings");
    }
    setLoading(false);
  };

  return {
    form,
    setForm,
    loading,
    addIP,
    removeIP,
    updateIP,
    updateSettings,
  };
};