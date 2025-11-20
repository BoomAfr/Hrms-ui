import { useState, useEffect } from 'react';
import { authAPI } from '../services/authServices';
import { departmentAPI } from '../services/departmentServices';
import { data } from 'react-router-dom';

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartments = async (page = 1, pageSize = 10, search = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await departmentAPI.getAll({
      page,
      page_size: pageSize,
      search,
    });
    setDepartments(response.data.results || []);
    return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const addDepartment = async (departmentData) => {
    console.log(departmentData,"departmentData"); 
    try {
      setLoading(true);
      await departmentAPI.create(departmentData);
      await fetchDepartments();
    }catch (err) {
      setError(err.response?.data?.message || 'Failed to add department');
    }finally {
      setLoading(false);
    }
  };

  // Update department (PUT/PATCH)
  const updateDepartment = async (id, data,Toast) => {
          setLoading(true);

    try {
      await departmentAPI.update(id, data);
      Toast.success("Department Updated Successfully")
      await fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update department');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete department
  const deleteDepartment = async (id) => {
    try {
      setLoading(true);
      await departmentAPI.delete(id); // DELETE /company/departments/<id>/
      await fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete department');
      throw err;
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    loading,
    error,
    refetch: fetchDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  };
};