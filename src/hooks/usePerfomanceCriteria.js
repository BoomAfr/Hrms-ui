import { useState, useEffect } from "react";
import { performanceCriteriaAPI } from "../services/perfomanceCriteriaServices";

export const usePerformanceCriteria = () => {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchCriteria = async (params = {}) => {
    try {
      setLoading(true);
      const res = await performanceCriteriaAPI.getAll(params);

      setCriteria(res.data.results ?? res.data);
      setTotal(res.data.count ?? res.data.results?.length ?? 0);
    } finally {
      setLoading(false);
    }
  };

  const addCriteria = async (data) => {
    await performanceCriteriaAPI.create(data);
    await fetchCriteria();
  };

  const updateCriteria = async (id, data) => {
    await performanceCriteriaAPI.update(id, data);
    await fetchCriteria();
  };

  const deleteCriteria = async (id) => {
    await performanceCriteriaAPI.delete(id);
    await fetchCriteria();
  };

  return {
    criteria,
    loading,
    total,
    refetch: fetchCriteria,
    addCriteria,
    updateCriteria,
    deleteCriteria,
  };
};