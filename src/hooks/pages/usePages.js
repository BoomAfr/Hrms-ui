import { useState, useEffect } from 'react';
import { pagesServicesAPI } from '../../services/pages/pagesServices';

export const usePages = () => {
  const [allPages, setAllPages] = useState([]);
  const [allowedPages, setAllowedPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllPages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await pagesServicesAPI.getAll();
      console.log(response,'response');
      
      setAllPages(response?.data || []);

      return response?.data; 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch roles');
      return null;
    } finally {
      setLoading(false);
    }
  };
  const fetchPagesByRole = async (roleId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await pagesServicesAPI.getByRole(roleId);
      console.log(response,'response');
      
      setAllowedPages(response?.data || []);
      // return response?.data; 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch roles');
      return null;
    } finally {
      setLoading(false);
    }
  };
  const updateRolePermission = async (roleId,selectedPages,Toast) => {
    setLoading(true);
    setError(null);
    try {
      const response = await pagesServicesAPI.updateRolePermission(roleId,selectedPages);
      console.log(response?.data?.message,'responseresponse');
      Toast.success(response?.data?.message)
      
      fetchPagesByRole(roleId);
      return response?.data; 
    } catch (err) {
        console.log(err,'errerrerrerrerr');
      Toast.error("something went wrong")
      setError(err.response?.data?.message || 'Failed to fetch roles');
      return null;
    } finally {
      setLoading(false);
    }
  };

  

  

  useEffect(() => {
    fetchAllPages();
  }, []);

  return {
    allPages,
    allowedPages,
    loading,
    error,
    updateRolePermission,
    fetchPagesByRole,
  };
};