import { useState, useEffect, useCallback } from "react";
import { performanceSummaryAPI } from "../services/perfomanceSummaryReportServices";

export const usePerformanceSummary = () => {
  const [rows, setRows] = useState([]);      
  const [employees, setEmployees] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchSummary = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const res = await performanceSummaryAPI.getAll(params);

      const data = res.data.results ?? res.data;
      setRows(data ?? []);
      setTotal(res.data.count ?? data?.length ?? 0);
    } catch (err) {
      console.error("Error fetching performance summary:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployees = useCallback(async (params = {}) => {
    try {
      setEmployeesLoading(true);
      const res = await performanceSummaryAPI.getEmployees(params);
      const data = res.data.results ?? res.data;
      setEmployees(data ?? []);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setEmployeesLoading(false);
    }
  }, []);

  return {
    rows,
    employees,
    loading,
    employeesLoading,
    total,
    fetchSummary,
    fetchEmployees,
  };
};