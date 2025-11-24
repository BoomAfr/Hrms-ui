import { useState, useEffect } from 'react';
import { addRoleAPI } from '../services/addRoleServices';
import { message } from 'antd';

export const useAddRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoles = async (page = 1, pageSize = 10, search = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await addRoleAPI.getAll({ page, page_size: pageSize, search });
      console.log(response,'response');
      
      setRoles(response?.data || []);
      return response?.data; // ensure caller gets {count, results, ...}
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch roles');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addRole = async (roleData) => {
    try {
      setLoading(true);
      await addRoleAPI.create(roleData);
      await fetchRoles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, data, Toast) => {
    setLoading(true);
    try {
      await addRoleAPI.update(id, data);
      Toast?.success('Role Updated Successfully');
      await fetchRoles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id) => {
    setLoading(true);
    try {
      await addRoleAPI.delete(id);
      await fetchRoles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    refetch: fetchRoles,
    addRole,
    updateRole,
    deleteRole,
  };
};