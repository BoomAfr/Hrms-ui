import { useState, useEffect } from 'react';
import { designationAPI } from '../services/designationServices';

export const useDesignations = () => {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    current: 1,
    pageSize: 10,
    search: '',
  });

  const fetchDesignations = async (page = 1, pageSize = 10, search = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await designationAPI.getAll(page, pageSize, search);
      const data = response.data;

      setDesignations(data.results || []);
      setPagination({
        count: data.count || 0,
        current: page,
        pageSize,
        search,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch designations');
    } finally {
      setLoading(false);
    }
  };
  


  const addDesignation = async (designationData) => {
    await designationAPI.create(designationData);
    await fetchDesignations(pagination.current, pagination.pageSize, pagination.search);
  };

  const updateDesignation = async (id, data) => {
    await designationAPI.update(id, data);
    await fetchDesignations(pagination.current, pagination.pageSize, pagination.search);
  };

  const deleteDesignation = async (id) => {
    await designationAPI.delete(id);
    await fetchDesignations(pagination.current, pagination.pageSize, pagination.search);
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  return {
    designations,
    loading,
    error,
    pagination,
    fetchDesignations,
    addDesignation,
    updateDesignation,
    deleteDesignation,
  };
};