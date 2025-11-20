import { useState, useEffect } from 'react';
import { hourlyPaygradeAPI } from '../services/hourlyPayGradeServices';

export const useHourlyPaygrades = () => {
  const [hourlyPaygrades, setHourlyPaygrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    count: 0,
    current: 1,
    pageSize: 10,
    search: '',
  });

  const fetchPaygrades = async (page = 1, pageSize = 10, search = '') => {
    try {
      setLoading(true);
      setError(null);

      const response = await hourlyPaygradeAPI.getAll(page, pageSize, search);
      const data = response.data;

      setHourlyPaygrades(data.results || []);

      setPagination({
        count: data.count || 0,
        current: page,
        pageSize,
        search,
      });

      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch hourly paygrades');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addPaygrade = async (payload) => {
    try {
      setLoading(true);
      await hourlyPaygradeAPI.create(payload);
      await fetchPaygrades(pagination.current, pagination.pageSize, pagination.search);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add paygrade');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePaygrade = async (id, payload) => {
    try {
      setLoading(true);
      await hourlyPaygradeAPI.update(id, payload);
      await fetchPaygrades(pagination.current, pagination.pageSize, pagination.search);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update paygrade');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePaygrade = async (id) => {
    try {
      setLoading(true);
      await hourlyPaygradeAPI.delete(id);
      await fetchPaygrades(pagination.current, pagination.pageSize, pagination.search);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete paygrade');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaygrades(1, 10, ''); 
  }, []);

  return {
    hourlyPaygrades,
    loading,
    error,
    pagination,
    fetchPaygrades,
    addPaygrade,
    updatePaygrade,
    deletePaygrade,
  };
};

export default useHourlyPaygrades;