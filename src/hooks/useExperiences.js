import { useState, useEffect } from 'react';
import { experienceAPI } from '../services/experienceApi';

export const useExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExperience = async (id) => {
    if (id) {
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

  const addExperience = async (id, payload) => {
    try {
      setLoading(true);
      await experienceAPI.create(id, payload);
      // await fetchExperience(id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add award');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExperience = async (employeeId, expId, data) => {
    try {
      setLoading(true);
      await experienceAPI.update(employeeId, expId, data);
      await fetchExperience(employeeId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update Experience');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (employeeId, expId) => {
    try {
      setLoading(true);
      await experienceAPI.delete(employeeId, expId);
      await fetchExperience(employeeId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete Experience');
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
