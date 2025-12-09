import { useState, useEffect, useCallback } from 'react';
import { awardAPI } from '../services/awardServices';
import { manageEmployeeApi } from '../services/manageEmployeeServices';

export const useAwards = ({ initialPage = 1, initialPageSize = 10, initialSearch = '' } = {}) => {
  const [awards, setAwards] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState(initialSearch);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAwards = useCallback(
    async ({ page: p = page, page_size: ps = pageSize, search: s = search } = {}) => {
      try {
        setLoading(true);
        setError(null);
        const params = { page: p, page_size: ps };
        if (s) params.search = s;
        const res = await awardAPI.getAll(params);
        const data = res.data;
        const results = Array.isArray(data.results) ? data.results : [];
        setAwards(results);
        setTotal(typeof data.count === 'number' ? data.count : results.length);
        setPage(p);
        setPageSize(ps);
        setSearch(s);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, search]
  );

  useEffect(() => {
    fetchAwards({ page, page_size: pageSize, search });
  }, []);

  const refetch = (opts = {}) => {
    const p = opts.page ?? page;
    const ps = opts.page_size ?? pageSize;
    const s = opts.search ?? search;
    fetchAwards({ page: p, page_size: ps, search: s });
  };

  const addAward = async (payload) => {
    try {
      setLoading(true);
      await awardAPI.create(payload);
      await fetchAwards({ page: 1, page_size: pageSize, search });
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAward = async (id, payload) => {
    try {
      setLoading(true);
      await awardAPI.update(id, payload);
      await fetchAwards({ page, page_size: pageSize, search });
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAward = async (id) => {
    try {
      setLoading(true);
      await awardAPI.delete(id);
      // refetch current page (server may adjust results)
      await fetchAwards({ page, page_size: pageSize, search });
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    awards,
    total,
    page,
    pageSize,
    search,
    loading,
    error,
    setPage,
    setPageSize,
    setSearch,
    fetchAwards,
    refetch,
    addAward,
    updateAward,
    deleteAward,
  };
};

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await manageEmployeeApi.getAll();
      if (Array.isArray(res?.data?.results)) {
        setEmployees(res.data.results);
      } else if (Array.isArray(res?.data)) {
        setEmployees(res.data);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return { employees, loading, refetch: fetchEmployees };
};

