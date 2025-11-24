/*import { useState, useEffect } from 'react';
import { LateConfigurationAPI } from '../../services/Payroll/lateConfigurationAPI';

export const useLateConfiguration = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRules = async (page = 1, pageSize = 10, search = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await LateConfigurationAPI.getAll({ page, page_size: pageSize, search });
      console.log(response,'response');
      
      setRules(response?.data || []);
      return response?.data; // ensure caller gets {count, results, ...}
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch roles');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addRule = async (roleData) => {
    try {
      setLoading(true);
      await LateConfigurationAPI.create(roleData);
      await fetchRules();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRule = async (id, data, Toast) => {
    setLoading(true);
    try {
      await LateConfigurationAPI.update(id, data);
      Toast?.success('Role Updated Successfully');
      await fetchRules();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRule = async (id) => {
    setLoading(true);
    try {
      await LateConfigurationAPI.delete(id);
      await fetchRules();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  return {
    rules,
    loading,
    error,
    refetch: fetchRules,
    addRule,
    updateRule,
    deleteRule,
  };
};*/
import { useState, useEffect } from "react";
import { lateConfigurationAPI } from "../../services/Payroll/lateConfigurationAPI";
import { useToast } from "../useToast";

export const useLateConfiguration = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const { Toast } = useToast(); // FIXED

  const fetchRules = async () => {
    try {
      setLoading(true);
      const res = await lateConfigurationAPI.getAll();
      setRules(res.data);
    } catch (err) {
      Toast.error("Failed to fetch rules"); 
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const createRule = async (data) => {
    try {
      const res = await lateConfigurationAPI.create(data);
      Toast.success("Rule created successfully"); 
      fetchRules();
      return res.data;
    } catch (err) {
      Toast.error("Failed to create rule"); 
      throw err;
    }
  };

  const updateRule = async (id, data) => {
    try {
      const res = await lateConfigurationAPI.update(id, data);
      Toast.success("Rule updated successfully"); 
      fetchRules();
      return res.data;
    } catch (err) {
      Toast.error("Failed to update rule"); 
      throw err;
    }
  };

  const deleteRule = async (id) => {
    try {
      await lateConfigurationAPI.delete(id);
      Toast.success("Rule deleted"); 
      fetchRules();
    } catch (err) {
      Toast.error("Failed to delete rule"); 
      throw err;
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  return {
    rules,
    loading,
    fetchRules,
    createRule,
    updateRule,
    deleteRule,
  };
};