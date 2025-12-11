import { useState, useEffect, useCallback } from "react";
import { monthlyPayGradeAPI } from "../services/monthlyPayGradeServices";

export const useMonthlyPayGrades = () => {
  const [paygrades, setPaygrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchPaygrades = useCallback(async (page = 1, pageSize = 10, search = "") => {
    try {
      setLoading(true);
      const params = {
        page,
        page_size: pageSize,
      };
      if (search) {
        params.search = search;
      }

      const response = await monthlyPayGradeAPI.getAll(params);

      
      if (response.data && response.data.results) {
        setPaygrades(response.data.results);
        setPagination({
          current: page,
          pageSize: pageSize,
          total: response.data.count || 0
        });
      } else {
        setPaygrades(response.data || []);
      }

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addPaygrade = async (data) => {
    try {
      await monthlyPayGradeAPI.create(data);
      fetchPaygrades(pagination.current, pagination.pageSize);
    } catch (err) {
      setError(err);
      throw err; 
    }
  };

  const updatePaygrade = async (id, data) => {
    try {
      await monthlyPayGradeAPI.update(id, data);
      fetchPaygrades(pagination.current, pagination.pageSize);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const deletePaygrade = async (id) => {
    try {
      await monthlyPayGradeAPI.delete(id);
      fetchPaygrades(pagination.current, pagination.pageSize);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    paygrades,
    loading,
    error,
    pagination,
    addPaygrade,
    updatePaygrade,
    deletePaygrade,
    fetchPaygrades,
  };
};