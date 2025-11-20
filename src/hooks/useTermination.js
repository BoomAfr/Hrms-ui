import { useState } from 'react';
import { terminationAPI } from '../services/terminationServices';
import { manageEmployeeApi } from '../services/manageEmployeeServices';

export const useTerminations = () => {
  const [terminations, setTerminations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchEmployees = async () => {
    try {
      const res = await manageEmployeeApi.getAll();
      setEmployees(res.data.results || []);
      
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTerminations = async (page = 1, pageSize = 10, search = '') => {
    setLoading(true);
    try {
      const res = await terminationAPI.getAll({ page, page_size: pageSize, search });
      setTerminations(res.data.results);
      setPagination({ current: page, pageSize, total: res.data.count });
      return res.data.results;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTermination = async (data, callback) => {
    try {
      await terminationAPI.create(data);
      if (callback) callback();
      fetchTerminations();
    } catch (err) {
      console.error(err);
    }
  };

  const updateTermination = async (id, data, callback) => {
    try {
      await terminationAPI.update(id, data);
      if (callback) callback();
      fetchTerminations();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTermination = async (id, callback) => {
    try {
      await terminationAPI.delete(id);
      if (callback) callback();
      fetchTerminations();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    terminations,
    employees,
    loading,
    pagination,
    fetchTerminations,
    fetchEmployees,
    addTermination,
    updateTermination,
    deleteTermination,
  };
};
