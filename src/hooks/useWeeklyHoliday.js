import { useState, useEffect } from 'react';
import { weeklyHolidayAPI } from '../services/weeklyHolidayServices';

export const useWeeklyHoliday = () => {
  const [weeklyHolidays, setWeeklyHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeeklyHolidays = async (page = 1, pageSize = 10, search = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await weeklyHolidayAPI.getAllPage({
            page,
            page_size: pageSize,
            search,
          });
      // Expect response.data to be array of objects like { id, day, status, ... }
      setWeeklyHolidays(response.data.results);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch weekly holidays');
    } finally {
      setLoading(false);
    }
  };

  const addWeeklyHoliday = async (data) => {
    try {
      setLoading(true);
      await weeklyHolidayAPI.create(data);
      await fetchWeeklyHolidays();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add weekly holiday');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateWeeklyHoliday = async (id, data) => {
    try {
      setLoading(true);
      await weeklyHolidayAPI.update(id, data);
      await fetchWeeklyHolidays();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update weekly holiday');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteWeeklyHoliday = async (id) => {
    try {
      setLoading(true);
      await weeklyHolidayAPI.delete(id);
      await fetchWeeklyHolidays();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete weekly holiday');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyHolidays();
  }, []);

  return {
    weeklyHolidays,
    loading,
    error,
    refetch: fetchWeeklyHolidays,
    addWeeklyHoliday,
    updateWeeklyHoliday,
    deleteWeeklyHoliday,
  };
};