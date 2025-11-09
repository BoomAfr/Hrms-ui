import { useState, useEffect } from 'react';
import { publicHolidayAPI } from '../services/publicHolidayServices';

export const usePublicHoliday = () => {
  const [publicHolidays, setPublicHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPublicHolidays = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await publicHolidayAPI.getAll();
      console.log("Public Holidays API response:", response.data);

      setPublicHolidays(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch public holidays');
    } finally {
      setLoading(false);
    }
  };

  const addPublicHoliday = async (data) => {
    try {
      setLoading(true);
      await publicHolidayAPI.create(data);
      await fetchPublicHolidays();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add public holiday');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePublicHoliday = async (id, data) => {
    try {
      setLoading(true);
      await publicHolidayAPI.update(id, data);
      await fetchPublicHolidays();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update public holiday');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePublicHoliday = async (id) => {
    try {
      setLoading(true);
      await publicHolidayAPI.delete(id);
      await fetchPublicHolidays();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete public holiday');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicHolidays();
  }, []);

  return {
    publicHolidays,
    loading,
    error,
    refetch: fetchPublicHolidays,
    addPublicHoliday,
    updatePublicHoliday,
    deletePublicHoliday,
  };
};
