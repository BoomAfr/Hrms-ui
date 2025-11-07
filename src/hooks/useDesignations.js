import { useState, useEffect } from 'react';
import { designationAPI } from '../services/designationServices';

export const useDesignations = () => {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDesignations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await designationAPI.getAll();
      setDesignations(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch designations');
    } finally {
      setLoading(false);
    }
  };

  const addDesignation = async (designationData) => {
    try {
      setLoading(true);
      await designationAPI.create(designationData);
      await fetchDesignations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add designation');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDesignation = async (id, data) => {
    try {
      setLoading(true);
      await designationAPI.update(id, data);
      await fetchDesignations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update designation');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDesignation = async (id) => {
    try {
      setLoading(true);
      await designationAPI.delete(id);
      await fetchDesignations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete designation');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  return {
    designations,
    loading,
    error,
    refetch: fetchDesignations,
    addDesignation,
    updateDesignation,
    deleteDesignation,
  };
};
