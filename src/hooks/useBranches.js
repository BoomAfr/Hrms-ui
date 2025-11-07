
import { useState, useEffect } from 'react';
import { branchAPI } from '../services/branchServices';

export const useBranches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await branchAPI.getAll();
      setBranches(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  const addBranch = async (branchData) => {
    try {
      setLoading(true);
      await branchAPI.create(branchData);
      await fetchBranches();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add branch');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBranch = async (id, data) => {
    try {
      setLoading(true);
      await branchAPI.update(id, data); // PUT /company/branches/<id>/
      await fetchBranches();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update branch');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBranch = async (id) => {
    try {
      setLoading(true);
      await branchAPI.delete(id); // DELETE /company/branches/<id>/
      await fetchBranches();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete branch');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return {
    branches,
    loading,
    error,
    refetch: fetchBranches,
    addBranch,
    updateBranch,
    deleteBranch,
  };
};

