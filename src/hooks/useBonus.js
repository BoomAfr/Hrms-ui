import { useState, useEffect } from 'react';
import {
  getBonusSettings,
  getEmployeeBonuses,
  generateBonus
} from '../services/bonusService';

export const useBonusSettings = () => {
  const [bonusSettings, setBonusSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBonusSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBonusSettings();

      setBonusSettings(data.results || data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch bonus settings');
      setBonusSettings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonusSettings();
  }, []);

  return { bonusSettings, loading, error, refetch: fetchBonusSettings };
};

export const useEmployeeBonuses = (filters = {}) => {
  const [bonuses, setBonuses] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBonuses = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getEmployeeBonuses({
        ...filters,
        ...params,
        page: params.page || pagination.current,
        page_size: params.pageSize || pagination.pageSize,
      });

      setBonuses(response.results || []);
      setPagination({
        current: params.page || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        total: response.count || 0,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch bonuses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonuses();
  }, [JSON.stringify(filters)]);

  return {
    bonuses,
    pagination,
    loading,
    error,
    refetch: fetchBonuses
  };
};

export const useGenerateBonus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const generate = async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await generateBonus(data);
      setResult(response);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to generate bonuses';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error, result };
};

export const useMarkBonusPaid = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const markPaid = async (data, exportCSV = false) => {
    setLoading(true);
    setError(null);
    try {
      // data should contain { payment_type: 'bonus', item_ids: [...], payment_method: '...', ... }
      const response = await import('../services/bonusService').then(module => module.markBonusPaid(data, exportCSV));

      if (exportCSV) {
        // Handle file download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        // Try to extract filename from headers
        const contentDisposition = response.headers['content-disposition'];
        let fileName = `bonus_payments_${new Date().toISOString().split('T')[0]}.csv`;
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
