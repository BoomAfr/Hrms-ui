import { useState, useEffect, useCallback } from "react";
import { allowanceAPI } from "../../services/Payroll/allowanceServices";
import { useToast } from "../../hooks/useToast";

export const useAllowances = () => {
  const { Toast } = useToast();

  const [allowances, setAllowances] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [search, setSearch] = useState("");

  const fetchAllowances = useCallback(
    async (page = pagination.current, pageSize = pagination.pageSize, q = search) => {
      try {
        setLoading(true);
        const params = {
          page,
          page_size: pageSize,
        };
        if (q && q.trim() !== "") params.search = q.trim();

        const res = await allowanceAPI.list(params);
        const list = res?.data?.results ?? res?.data ?? [];
        const total = res?.data?.count ?? list.length;

        setAllowances(list);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
          total,
        }));
      } catch (err) {
        console.error("Failed to fetch allowances", err);
        Toast.error("Failed to load allowances");
      } finally {
        setLoading(false);
      }
    },
    [Toast, pagination.current, pagination.pageSize, search]
  );

  useEffect(() => {
    fetchAllowances(pagination.current, pagination.pageSize, search);
  }, [pagination.current, pagination.pageSize, search]);

  const handleSearch = (q) => {
    setSearch(q);
    setPagination((p) => ({ ...p, current: 1 }));
  };

  const createAllowance = async (payload) => {
    try {
      setLoading(true);
      const res = await allowanceAPI.create(payload);
      Toast.success("Allowance created");
      await fetchAllowances(1, pagination.pageSize, search);
      return res.data;
    } catch (err) {
      console.error("Create allowance failed", err);
      const msg = err?.response?.data
        ? (typeof err.response.data === "string" ? err.response.data : JSON.stringify(err.response.data))
        : "Failed to create allowance";
      Toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAllowance = async (id, payload) => {
    try {
      setLoading(true);
      const res = await allowanceAPI.update(id, payload);
      Toast.success("Allowance updated");
      await fetchAllowances(pagination.current, pagination.pageSize, search);
      return res.data;
    } catch (err) {
      console.error("Update allowance failed", err);
      const msg = err?.response?.data
        ? (typeof err.response.data === "string" ? err.response.data : JSON.stringify(err.response.data))
        : "Failed to update allowance";
      Toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAllowance = async (id) => {
    try {
      setLoading(true);
      await allowanceAPI.delete(id);
      Toast.success("Allowance deleted");
      const nextFetch = async () => {
        const res = await allowanceAPI.list({
          page: pagination.current,
          page_size: pagination.pageSize,
          ...(search ? { search } : {}),
        });
        const list = res?.data?.results ?? [];
        if (list.length === 0 && pagination.current > 1) {
          setPagination((p) => ({ ...p, current: p.current - 1 }));
        } else {
          setAllowances(list);
          setPagination((p) => ({ ...p, total: res?.data?.count ?? list.length }));
        }
      };
      await nextFetch();
    } catch (err) {
      console.error("Delete allowance failed", err);
      Toast.error("Failed to delete allowance");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    allowances,
    loading,
    pagination,
    setPagination,
    fetchAllowances,
    handleSearch,
    createAllowance,
    updateAllowance,
    deleteAllowance,
  };
};
