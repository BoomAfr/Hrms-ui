import { useState, useEffect } from 'react';
import { performanceCategoryAPI } from '../services/perfomanceCategoryServices';

export const usePerformanceCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await performanceCategoryAPI.getAll();
      setCategories(res.data.results);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (data) => {
    try {
      setLoading(true);
      await performanceCategoryAPI.create(data);
      await fetchCategories();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, data) => {
    try {
      setLoading(true);
      await performanceCategoryAPI.update(id, data);
      await fetchCategories();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      await performanceCategoryAPI.delete(id);
      await fetchCategories();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};