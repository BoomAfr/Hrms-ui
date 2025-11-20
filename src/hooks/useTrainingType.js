import { useState, useEffect } from 'react';
import { trainingTypeAPI } from '../services/trainingTypeServices';

export const useTrainingTypes = () => {
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrainingTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await trainingTypeAPI.getAll();
      // handle both list and paginated result shapes
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setTrainingTypes(data);
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch training types');
    } finally {
      setLoading(false);
    }
  };

  const addTrainingType = async (payload) => {
    try {
      setLoading(true);
      await trainingTypeAPI.create(payload);
      await fetchTrainingTypes();
    } catch (err) {
      setError(err.response?.data || 'Failed to add training type');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTrainingType = async (id, payload) => {
    try {
      setLoading(true);
      await trainingTypeAPI.update(id, payload);
      await fetchTrainingTypes();
    } catch (err) {
      setError(err.response?.data || 'Failed to update training type');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTrainingType = async (id) => {
    try {
      setLoading(true);
      await trainingTypeAPI.delete(id);
      await fetchTrainingTypes();
    } catch (err) {
      setError(err.response?.data || 'Failed to delete training type');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingTypes();
  }, []);

  return {
    trainingTypes,
    loading,
    error,
    refetch: fetchTrainingTypes,
    addTrainingType,
    updateTrainingType,
    deleteTrainingType,
  };
};
