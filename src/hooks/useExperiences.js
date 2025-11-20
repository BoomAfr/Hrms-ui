import { useState, useEffect } from 'react';
import { experienceAPI } from '../services/experienceApi';

export const useExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExperience = async (id) => {
    if(id){
    try {
      setLoading(true);
      setError(null);
      const response = await experienceAPI.getById(id);
      setExperiences(response.data.results);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch awards');
    } finally {
      setLoading(false);
    }
    }
  };

  const addExperience = async (id) => {
    try {
      setLoading(true);
      await experienceAPI.create(id);
      await fetchExperience(id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add award');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExperience = async (id, data) => {
    try {
      setLoading(true);
      await experienceAPI.update(id, data);
      await fetchExperience(id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update award');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (id) => {
    try {
      setLoading(true);
      await experienceAPI.delete(id);
      await fetchExperience();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete award');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  return {
    experiences,
    loading,
    error,
    fetchExperience,
    addExperience,
    updateExperience,
    deleteExperience,
    
  };
};
