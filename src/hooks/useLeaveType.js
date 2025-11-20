import { useState, useEffect } from 'react';
import { leaveTypeAPI } from '../services/leaveTypeServices';

export const useLeaveTypes = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaveTypes = async (page = 1, pageSize = 10, search = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await leaveTypeAPI.getAllPage({
            page,
            page_size: pageSize,
            search,
          });
      setLeaveTypes(response.data.results);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leave types');
    } finally {
      setLoading(false);
    }
  };

  const addLeaveType = async (data) => {
    try {
      setLoading(true);
      await leaveTypeAPI.create(data);
      await fetchLeaveTypes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add leave type');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveType = async (id, data) => {
    try {
      setLoading(true);
      await leaveTypeAPI.update(id, data);
      await fetchLeaveTypes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update leave type');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLeaveType = async (id) => {
    try {
      setLoading(true);
      await leaveTypeAPI.delete(id);
      await fetchLeaveTypes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete leave type');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  return {
    leaveTypes,
    loading,
    error,
    refetch: fetchLeaveTypes,
    addLeaveType,
    updateLeaveType,
    deleteLeaveType,
  };
};