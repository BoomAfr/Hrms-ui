import { useState, useEffect, useRef } from "react";
import { message } from "antd";
import { employeePermanentAPI } from "../services/employeePermanentServices";

export const useEmployeePermanent = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [filtersLoading, setFiltersLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    department_id: "",
    designation_id: "",
    role: "",
  });

  const searchTimeout = useRef(null);

  const fetchFilterOptions = async () => {
    setFiltersLoading(true);
    try {
      const [dRes, desRes, rRes] = await Promise.all([
        employeePermanentAPI.getDepartments(),
        employeePermanentAPI.getDesignations(),
        employeePermanentAPI.getRoles(),
      ]);

      setDepartments(dRes?.data?.results || dRes?.data || []);
      setDesignations(desRes?.data?.results || desRes?.data || []);
      setRoles(rRes?.data?.results || rRes?.data || []);
    } catch (err) {
      console.error("Failed to load filter options", err);
      message.error("Failed to load filters");
    } finally {
      setFiltersLoading(false);
    }
  };

  const fetchEmployees = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const params = {
        search: filters.search || undefined,
        department_id: filters.department_id || undefined,
        designation_id: filters.designation_id || undefined,
        role: filters.role || undefined,
        page,
        page_size: pageSize,
      };

      const res = await employeePermanentAPI.getEmployees(params);

      const list = res?.data?.results || res?.data || [];
      setEmployees(list);
      setPagination((prev) => ({
        ...prev,
        total: res?.data?.count ?? list.length,
        current: page,
        pageSize,
      }));
    } catch (err) {
      console.error("Failed to load employees", err);
      message.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  // debounce search
  const setSearch = (value) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: value }));
      setPagination((prev) => ({ ...prev, current: 1 }));
    }, 300);
  };

  // update job status for a specific employee
  const updateJobStatus = async (id, job_status, Toast) => {
    try {
      setLoading(true);
      const payload = { job_status };
      const res = await employeePermanentAPI.updateJobStatus(id, payload);
      Toast?.success?.("Status updated successfully");
      // refresh list
      await fetchEmployees(pagination.current, pagination.pageSize);
      return res.data;
    } catch (err) {
      console.error("Failed to update job status", err);
      Toast?.error?.("Failed to update status");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [pagination.current, pagination.pageSize, filters.search, filters.department_id, filters.designation_id, filters.role]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  return {
    employees,
    departments,
    designations,
    roles,
    loading,
    filtersLoading,
    filters,
    setFilters,
    setSearch,
    pagination,
    setPagination,
    fetchEmployees,
    updateJobStatus,
  };
};