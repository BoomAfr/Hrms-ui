import { useState, useEffect } from 'react';
import { manageHolidayAPI } from '../services/manageHolidayServices';

export const useManageHoliday = () => {
  const [manageHoliday, setManageHoliday] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchManageHoliday = async (page = 1, pageSize = 10, search = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await manageHolidayAPI.getALLPage({
            page,
            page_size: pageSize,
            search,
          });
      setManageHoliday(response.data.results || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch holidays');
    } finally {
      setLoading(false);
    }
  };

  const addManageHoliday = async (data) => {
    try {
      setLoading(true);
      await manageHolidayAPI.create(data);
      await fetchManageHoliday();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add holiday');
    } finally {
      setLoading(false);
    }
  };

  const updateManageHoliday = async (id, data) => {
    try {
      setLoading(true);
      await manageHolidayAPI.update(id, data);
      await fetchManageHoliday();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update holiday');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteManageHoliday = async (id) => {
    try {
      setLoading(true);
      await manageHolidayAPI.delete(id);
      await fetchManageHoliday();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete holiday');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManageHoliday();
  }, []);

  return {
    manageHoliday,
    loading,
    error,
    refetch: fetchManageHoliday,
    addManageHoliday,
    updateManageHoliday,
    deleteManageHoliday,
  };
};
