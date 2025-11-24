import { useState, useEffect } from 'react';
import { promotionApi, manageEmployeeApi, departmentApi, designationApi, paygradeApi } from '../services/promotionServices';
import { message } from 'antd';
import dayjs from 'dayjs';

export const usePromotion = () => {
  const [promotions, setPromotions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [paygrades, setPaygrades] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Helper to format date in payload (if using dayjs objects)
  const formatDate = (data) => {
    if (data.promotion_date?.$d || (data.promotion_date?.format && typeof data.promotion_date.format === 'function')) {
      return { ...data, promotion_date: data.promotion_date.format ? data.promotion_date.format('YYYY-MM-DD') : dayjs(data.promotion_date).format('YYYY-MM-DD') };
    }
    return data;
  };

  const fetchPromotions = async (page = 1, pageSize = 10, search = '') => {
    setLoading(true);
    try {
      const res = await promotionApi.getAll({ page, page_size: pageSize, search });
      // DRF paginated response: res.data.results
      setPromotions(res.data.results || []);
      setPagination({
        current: page,
        pageSize,
        total: res.data.count ?? 0,
      });
      return res.data;
    } catch (err) {
      console.error('Error fetching promotions', err);
      message.error('Failed to fetch promotions');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await manageEmployeeApi.getAll();
      console.log(res.data.results);
      setEmployees(res.data.results || []);
    } catch (err) {
      console.error('Error fetching employees', err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await departmentApi.getAll();
      setDepartments(res.data.results || []);
    } catch (err) {
      console.error('Error fetching departments', err);
    }
  };

  const fetchDesignations = async () => {
    try {
      const res = await designationApi.getAll();
      setDesignations(res.data.results || []);
    } catch (err) {
      console.error('Error fetching designations', err);
    }
  };

  const fetchPaygrades = async () => {
    try {
      const res = await paygradeApi.getAll();
      setPaygrades(res.data.results || []);
    } catch (err) {
      console.error('Error fetching paygrades', err);
    }
  };

  const addPromotion = async (data, onSuccess) => {
    try {
      setLoading(true);
      const payload = formatDate(data);
      // Ensure promoted_salary field provided (we set in modal)
      await promotionApi.create(payload);
      message.success('Promotion added successfully');
      fetchPromotions(); // refresh
      onSuccess?.();
    } catch (err) {
      console.error('Failed to create promotion', err);
      message.error('Failed to add promotion');
    } finally {
      setLoading(false);
    }
  };

  const updatePromotion = async (id, data, onSuccess) => {
    try {
      setLoading(true);
      const payload = formatDate(data);
      await promotionApi.update(id, payload);
      message.success('Promotion updated successfully');
      fetchPromotions();
      onSuccess?.();
    } catch (err) {
      console.error('Failed to update promotion', err);
      message.error('Failed to update promotion');
    } finally {
      setLoading(false);
    }
  };

  const deletePromotion = async (id, onSuccess) => {
    try {
      setLoading(true);
      await promotionApi.delete(id);
      message.success('Promotion deleted successfully');
      fetchPromotions();
      onSuccess?.();
    } catch (err) {
      console.error('Failed to delete promotion', err);
      message.error('Failed to delete promotion');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load
    fetchPromotions();
    fetchEmployees();
    fetchDepartments();
    fetchDesignations();
    fetchPaygrades();
  }, []);

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
    addPromotion,
    updatePromotion,
    deletePromotion,
  };
};