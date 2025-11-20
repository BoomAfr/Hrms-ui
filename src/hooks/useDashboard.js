import { useState, useEffect } from 'react';
import { departmentAPI } from '../services/departmentServices';
import { dashboardAPI } from '../services/dashboardService';


export const useDashboard = () => {
  const [dashboardData, setDashBoardData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardAPI.getAll();
    setDashBoardData(response.data);
    // return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  // const addDepartment = async (departmentData) => {
  //   console.log(departmentData,"departmentData"); 
  //   try {
  //     setLoading(true);
  //     await departmentAPI.create(departmentData);
  //     await fetchDepartments();
  //   }catch (err) {
  //     setError(err.response?.data?.message || 'Failed to add department');
  //   }finally {
  //     setLoading(false);
  //   }
  // };

  // Update department (PUT/PATCH)
  // const updateDepartment = async (id, data,Toast) => {
  //         setLoading(true);

  //   try {
  //     await departmentAPI.update(id, data);
  //     Toast.success("Department Updated Successfully")
  //     await fetchDepartments();
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Failed to update department');
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Delete department
  // const deleteDepartment = async (id) => {
  //   try {
  //     setLoading(true);
  //     await departmentAPI.delete(id); // DELETE /company/departments/<id>/
  //     await fetchDepartments();
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Failed to delete department');
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    dashboardData,
    loading,
    error,
  };
};