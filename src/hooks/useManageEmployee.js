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

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

   const [filters, setFilters] = useState({
    search: "",
    department_id: "",
    designation_id: "",
    role: "",
  });


  const fetchEmployee = async () => {
  try {
    setLoading(true);
    setError(null);

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      search: filters.search || "",
      department_id: filters.department_id || "",
      designation_id: filters.designation_id || "",
      role: filters.role || "",
    };

    const response = await manageEmployeeApi.getAll(params);

    setEmployees(response?.data?.results || []);
    setPagination(prev => ({
      ...prev,
      total: response?.data?.count || 0
    }));

    setSupervisors(response.data?.results || response.data || []);

  } catch (err) {
    setError(err.response?.data?.message || 'Failed to fetch employees');
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
      const resp =  await manageEmployeeApi.create(employeeData);
        Toast.success('success', resp?.message || 'Employee added successfully')
        await fetchEmployee();
      // }

    } catch (err) {
      console.log(err,'err')
      setError(err?.message || 'Failed to add department');
        Toast.error('error', err?.message || 'Failed to add employee')

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
  }, [pagination.current, pagination.pageSize, filters.search, filters.department_id, filters.designation_id, filters.role]);

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
    pagination,
  setPagination,
  filters,
  setFilters,
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