import { useState, useEffect } from 'react';
import { manageEmployeeApi } from '../services/manageEmployeeServices';
import { educationAPI } from '../services/educationServices';

export const useEducational = () => {
  const [educationals, setEducationals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEducation = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await educationAPI.getById(id);
      setEducationals(response.data.results);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch education');
    } finally {
      setLoading(false);
    }
  };

  const addEducation = async (id, data) => {
    try {
      setLoading(true);
      await educationAPI.create(id, data);
      await fetchEducation(id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add education');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEducation = async (empId, eduId, data) => {
    try {
      setLoading(true);
      await educationAPI.patch(empId, eduId, data);
      await fetchEducation(empId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update education');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEducation = async (empId, eduId) => {
    try {
      setLoading(true);
      await educationAPI.delete(empId, eduId);
      await fetchEducation(empId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete education');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  return {
    educationals,
    loading,
    error,
    refetch: fetchEducation,
    addEducation,
    updateEducation,
    deleteEducation,

  };
};
export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await manageEmployeeApi.getAll();
      if (Array.isArray(res?.data?.results)) {
        setEmployees(res.data.results);
      } else if (Array.isArray(res?.data)) {
        setEmployees(res.data);
      } else if (Array.isArray(res)) {
        setEmployees(res);
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return { employees, loading, refetch: fetchEmployees };
};

