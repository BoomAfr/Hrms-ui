import { useState, useEffect } from "react";
import { trainingReportAPI, employeeAPI } from "../services/trainingReportServices";

export const useTrainingReport = () => {
  const [reportData, setReportData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    try {
      const res = await employeeAPI.getAll();
      setEmployees(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      setError(err);
    }
  };

  const fetchReport = async (employeeId) => {
    try {
      setLoading(true);
      const res = await trainingReportAPI.getReport(employeeId);
      setReportData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    reportData,
    employees,
    loading,
    error,
    fetchReport,
  };
};