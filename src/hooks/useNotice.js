import { useState, useEffect } from 'react';
import { noticeAPI } from '../services/noticeServices';

export const useNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await noticeAPI.getAll();
      setNotices(res.data.results);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const addNotice = async (formData) => {
    try {
      setLoading(true);
      await noticeAPI.create(formData);
      await fetchNotices();
    } catch (err) {
      setError(err.response?.data || 'Failed to add notice');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateNotice = async (id, formData) => {
    try {
      setLoading(true);
      await noticeAPI.update(id, formData);
      await fetchNotices();
    } catch (err) {
      setError(err.response?.data || 'Failed to update notice');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteNotice = async (id) => {
    try {
      setLoading(true);
      await noticeAPI.delete(id);
      await fetchNotices();
    } catch (err) {
      setError(err.response?.data || 'Failed to delete notice');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return { notices, loading, error, refetch: fetchNotices, addNotice, updateNotice, deleteNotice };
};