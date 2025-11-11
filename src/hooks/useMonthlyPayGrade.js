import { useState, useEffect } from "react";
import { monthlyPayGradeAPI } from "../services/monthlyPayGradeServices";

export const useMonthlyPayGrades = () => {
  const [paygrades, setPaygrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPaygrades = async () => {
    try {
      setLoading(true);
      const response = await monthlyPayGradeAPI.getAll();
      setPaygrades(response.data.results);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addPaygrade = async (data) => {
    try {
      const response = await monthlyPayGradeAPI.create(data);
      setPaygrades((prev) => [...prev, response.data]);
    } catch (err) {
      setError(err);
    }
  };

  const updatePaygrade = async (id, data) => {
    try {
      const response = await monthlyPayGradeAPI.update(id, data);
      setPaygrades((prev) =>
        prev.map((item) => (item.id === id ? response.data : item))
      );
    } catch (err) {
      setError(err);
    }
  };

  const deletePaygrade = async (id) => {
    try {
      await monthlyPayGradeAPI.delete(id);
      setPaygrades((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchPaygrades();
  }, []);

  return {
    paygrades,
    loading,
    error,
    addPaygrade,
    updatePaygrade,
    deletePaygrade,
    fetchPaygrades,
  };
};