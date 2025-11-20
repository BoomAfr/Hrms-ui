import { useState, useEffect } from "react";
import { warningApi } from "../services/warningServices";
import { manageEmployeeApi } from "../services/manageEmployeeServices";
import { message } from "antd";

export const useWarning = () => {
  const [warnings, setWarnings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const formatDate = (data) => {
    if (data.warning_date?.$d) {
      return {
        ...data,
        warning_date: data.warning_date.format("YYYY-MM-DD"),
      };
    }
    return data;
  };

  const fetchWarnings = async (page = 1, pageSize = 10, search = "") => {
    try {
      setLoading(true);
      const res = await warningApi.getAll({
        page,
        page_size: pageSize,
        search,
      });

      setWarnings(res.data.results || []);
      setPagination({
        current: page,
        pageSize,
        total: res.data.count,
      });
    } catch (err) {
      console.error("Error fetching warnings");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await manageEmployeeApi.getAll();
      setEmployees(res.data.results || []);
    } catch (err) {
      console.error("Error fetching employees");
    }
  };

  const addWarning = async (data, onSuccess) => {
    try {
      setLoading(true);
      const formatted = formatDate(data);
      await warningApi.create(formatted);
      message.success("Warning added successfully");
      fetchWarnings();
      onSuccess?.();
    } catch (err) {
      message.error("Failed to add warning");
    } finally {
      setLoading(false);
    }
  };

  const updateWarning = async (id, data, onSuccess) => {
    try {
      setLoading(true);
      const formatted = formatDate(data);
      await warningApi.update(id, formatted);
      message.success("Warning updated successfully");
      fetchWarnings();
      onSuccess?.();
    } catch (err) {
      message.error("Failed to update warning");
    } finally {
      setLoading(false);
    }
  };

  const deleteWarning = async (id, onSuccess) => {
    try {
      setLoading(true);
      await warningApi.delete(id);
      message.success("Warning deleted successfully");
      fetchWarnings();
      onSuccess?.();
    } catch (err) {
      message.error("Failed to delete warning");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarnings();
    fetchEmployees();
  }, []);

  return {
    warnings,
    employees,
    loading,
    pagination,
    fetchWarnings,
    addWarning,
    updateWarning,
    deleteWarning,
  };
};