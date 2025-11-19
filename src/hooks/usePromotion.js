import { useState, useEffect } from 'react';
import { promotionAPI, departmentAPI, designationAPI, paygradeAPI } from '../services/promotionServices';
import { manageEmployeeApi } from '../services/manageEmployeeServices';

export const usePromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [paygrades, setPaygrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await manageEmployeeApi.getAll();
      setEmployees(res.data.results || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch departments, designations, paygrades
  const fetchDropdowns = async () => {
    try {
      const [deptRes, desigRes, payRes] = await Promise.all([
        departmentAPI.getAll(),
        designationAPI.getAll(),
        paygradeAPI.getAll(),
      ]);
      setDepartments(deptRes.data.results || []);
      setDesignations(desigRes.data.results || []);
      setPaygrades(payRes.data.results || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPromotions = async (page = 1, pageSize = 10, search = '') => {
    setLoading(true);
    try {
      const res = await promotionAPI.getAll({ page, page_size: pageSize, search });
      setPromotions(res.data.results);
      setPagination({ current: page, pageSize, total: res.data.count });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addPromotion = async (data, callback) => {
    try {
      await promotionAPI.create(data);
      if (callback) callback();
      fetchPromotions();
    } catch (err) {
      console.error(err);
    }
  };

  const updatePromotion = async (id, data, callback) => {
    try {
      await promotionAPI.update(id, data);
      if (callback) callback();
      fetchPromotions();
    } catch (err) {
      console.error(err);
    }
  };

  const deletePromotion = async (id, callback) => {
    try {
      await promotionAPI.delete(id);
      if (callback) callback();
      fetchPromotions();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    promotions,
    employees,
    departments,
    designations,
    paygrades,
    loading,
    pagination,
    fetchPromotions,
    fetchEmployees,
    fetchDropdowns,
    addPromotion,
    updatePromotion,
    deletePromotion,
  };
};
