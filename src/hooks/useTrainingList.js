import { useState, useEffect, useCallback } from "react";
import { employeeTrainingAPI } from "../services/trainingListServices";

export const useEmployeeTrainings = ({
  initialPage = 1,
  initialPageSize = 10,
  initialSearch = "",
} = {}) => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(initialSearch);

  const fetchTrainings = useCallback(
    async ({ page: p = page, page_size: ps = pageSize, search: s = search } = {}) => {
      try {
        setLoading(true);
        setError(null);
        const params = {
          page: p,
          page_size: ps,
        };
        if (s) params.search = s;
        const response = await employeeTrainingAPI.getAll(params);
        const data = response.data;
        setTrainings(Array.isArray(data.results) ? data.results : []);
        setTotal(typeof data.count === "number" ? data.count : data.results.length);
        setPage(p);
        setPageSize(ps);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, search]
  );

  useEffect(() => {
    fetchTrainings({ page, page_size: pageSize, search });
  }, []); 

  const refetch = (opts = {}) => {
    const p = opts.page ?? page;
    const ps = opts.page_size ?? pageSize;
    const s = opts.search ?? search;
    setSearch(s);
    fetchTrainings({ page: p, page_size: ps, search: s });
  };

  const addTraining = async (formData) => {
    try {
      setLoading(true);
      const response = await employeeTrainingAPI.create(formData);
      setTrainings((prev) => [response.data, ...prev]);
      setTotal((t) => t + 1);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTraining = async (id, formData) => {
    try {
      setLoading(true);
      const response = await employeeTrainingAPI.update(id, formData);
      setTrainings((prev) => prev.map((item) => (item.id === id ? response.data : item)));
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTraining = async (id) => {
    try {
      setLoading(true);
      await employeeTrainingAPI.delete(id);
      setTrainings((prev) => prev.filter((item) => item.id !== id));
      setTotal((t) => Math.max(0, t - 1));
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    trainings,
    loading,
    error,
    page,
    pageSize,
    total,
    search,
    setSearch,
    setPage,
    setPageSize,
    fetchTrainings,
    refetch,
    addTraining,
    updateTraining,
    deleteTraining,
  };
};