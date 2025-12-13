import { useState, useEffect } from 'react';
import { accountAPI } from '../services/accountService';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccounts = async (employeeId) => {
    if (employeeId) {
      try {
        setLoading(true);
        setError(null);
        const response = await accountAPI.getById(employeeId);
        setAccounts(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch account details');
      } finally {
        setLoading(false);
      }
    }
  };

  const addAccount = async (employeeId, payload) => {
    try {
      setLoading(true);
      await accountAPI.create(employeeId, payload);
      await fetchAccounts(employeeId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add account details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAccount = async (employeeId, accountId, data) => {
    try {
      setLoading(true);
      await accountAPI.update(employeeId, accountId, data);
      await fetchAccounts(employeeId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update account details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (employeeId, accountId) => {
    try {
      setLoading(true);
      await accountAPI.delete(employeeId, accountId);
      await fetchAccounts(employeeId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
  };
};
