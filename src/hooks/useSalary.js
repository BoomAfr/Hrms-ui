import { useState, useEffect, useCallback } from 'react';
import {
  getSalarySheets,
  generateSinglePayslip,
  generateBulkPayslips,
  getPayslip
} from '../services/salaryService';

/**
 * Hook to fetch salary sheets list
 */
export const useSalarySheets = (initialFilters = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSalarySheets = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = {
        ...initialFilters,
        ...params,
        page: params.page || pagination.current,
        page_size: params.pageSize || pagination.pageSize,
      };


      if (!queryParams.month && !initialFilters.month) {

      }

      const response = await getSalarySheets(queryParams);
      setData(response.results || response.data || []);
      setPagination({
        current: params.page || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        total: response.count || 0,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch salary sheets');
    } finally {
      setLoading(false);
    }
  }, [initialFilters, pagination.current, pagination.pageSize]);

  return {
    data,
    pagination,
    loading,
    error,
    fetchSalarySheets
  };
};

/**
 * Hook to generate single payslip
 */
export const useGeneratePayslip = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const generate = async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await generateSinglePayslip(data);
      setResult(response);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to generate payslip';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error, result };
};

/**
 * Hook to generate bulk payslips
 */
export const useGenerateBulkPayslip = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const generateBulk = async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await generateBulkPayslips(data);
      setResult(response);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to generate bulk payslips';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateBulk, loading, error, result };
};

/**
 * Hook to fetch single payslip details
 */
export const usePayslip = (id) => {
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPayslip = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPayslip(id);
      setPayslip(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch payslip details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPayslip();
  }, [fetchPayslip]);

  return { payslip, loading, error, refetch: fetchPayslip };
};

/**
 * Hook to mark salary as paid
 */
export const useMarkSalaryPaid = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const markPaid = async (data, exportCSV = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await import('../services/salaryService').then(module => module.markPaymentPaid(data, exportCSV));

      if (exportCSV) {
        // Handle file download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        // Try to extract filename from headers
        const contentDisposition = response.headers['content-disposition'];
        let fileName = `salary_payments_${new Date().toISOString().split('T')[0]}.csv`;
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
          if (fileNameMatch && fileNameMatch.length === 2)
            fileName = fileNameMatch[1];
        }

        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }

      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.error || (err.message && err.message !== 'canceled' ? err.message : 'Failed to payment');
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { markPaid, loading, error };
};
