import { useState, useEffect } from 'react';
import { awardAPI } from '../services/awardServices';

export const useAwards = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAwards = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await awardAPI.getAll();
      setAwards(response.data.results);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch awards');
    } finally {
      setLoading(false);
    }
  };

  const addAward = async (awardData) => {
    try {
      setLoading(true);
      await awardAPI.create(awardData);
      await fetchAwards();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add award');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAward = async (id, data) => {
    try {
      setLoading(true);
      await awardAPI.update(id, data);
      await fetchAwards();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update award');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAward = async (id) => {
    try {
      setLoading(true);
      await awardAPI.delete(id);
      await fetchAwards();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete award');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  return {
    awards,
    loading,
    error,
    refetch: fetchAwards,
    addAward,
    updateAward,
    deleteAward,
  };
};

