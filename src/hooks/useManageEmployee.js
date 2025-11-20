import { useState, useEffect } from 'react';
import { authAPI } from '../services/authServices';
import { departmentAPI } from '../services/departmentServices';
import { data } from 'react-router-dom';
import { manageEmployeeApi } from '../services/manageEmployeeServices';
import { workShiftAPI, WorkShiftAPI } from '../services/manageWorkShiftServices'


export const useManageEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [profile,setProfile] = useState({});
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  let message, description;


  const fetchEmployee = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await manageEmployeeApi.getAll();
      console.log(response, 'response')
      setEmployees(response?.data.results);
      setSupervisors(response.data?.results || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };
const fetchEmployeeById = async(id)=>{
  setLoading(true);
  setError(null);
  try{
    const response = await manageEmployeeApi.getById(id);
    setProfile(response?.data)
  }catch(error){
          setError(error.response?.data?.message || 'Failed to fetch employee');
  }finally{
    setLoading(false);
  }
}
  const addEmployee = async (employeeData, Toast) => {
    try {
      setLoading(true);
       await manageEmployeeApi.create(employeeData);
        Toast.success('success', 'Employee added successfully')
        await fetchEmployee();
      // }

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add department');
        Toast.error('error', 'Failed to add employee')

    } finally {
      setLoading(false);
    }
  };


  // Update department (PUT/PATCH)
  const updateEmployee = async (id, data,Toast) => {
    try {
      setLoading(true);
      await manageEmployeeApi.update(id, data);
            Toast.success('success', 'Employee Updated successfully')

      // await fetchEmployee();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update department');
                  Toast.error('error', 'Something went wrong')

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete department
  const deleteEmployee = async (id,Toast) => {
    try {
      setLoading(true);
      await manageEmployeeApi.delete(id); 
      Toast.success('success', 'Employee Deleted successfully')
      fetchEmployee();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete department');
            Toast.error('error', 'Something went wrong')
      throw err;
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchEmployee();
  }, []);

  return {
    employees,
    loading,
    error,
    addEmployee,
    supervisors,
    deleteEmployee,
    fetchEmployeeById,
    profile,
    updateEmployee,
    // refetch: fetchDepartments,
    // addDepartment,
    // updateDepartment,
    // deleteDepartment,
  };
};

export const useShift = () => {
  const [shifts, setShifts] = useState([]);

  const fetchShifts = async () => {
    try {
      const response = await workShiftAPI.getAllActive();
      setShifts(response?.data?.results || response?.data || []);
    } catch (err) {
      console.error("Failed to fetch working shifts", err);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  return { shifts };
};