import { useState, useCallback } from 'react';
import { myPayrollAPI } from '../services/myPayrollService';

export const useMyPayroll = () => {
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchMyPayroll = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const params = {
        page,
        page_size: pageSize,
      };
      const response = await myPayrollAPI.getMyPayroll(params);

      setPayrollHistory(response.data.results || []);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response.data.count || 0,
      });
    } catch (error) {
      console.error("Failed to fetch payroll history", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    payrollHistory,
    loading,
    pagination,
    fetchMyPayroll,
  };
};
