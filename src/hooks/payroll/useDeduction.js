import { useState, useEffect, useCallback } from "react";
import { deductionAPI } from "../../services/Payroll/deductionServices";
import { useToast } from "../../hooks/useToast";

export const useDeductions = () => {
  const { Toast } = useToast();

  const [deductions, setDeductions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [search, setSearch] = useState("");

  const fetchDeductions = useCallback(
    async (page = pagination.current, pageSize = pagination.pageSize, q = search) => {
      try {
        setLoading(true);
        const params = { page, page_size: pageSize };
        if (q && q.trim() !== "") params.search = q.trim();

        const res = await deductionAPI.list(params);
        const list = res?.data?.results ?? res?.data ?? [];
        const total = res?.data?.count ?? list.length;

        setDeductions(list);
        setPagination((prev) => ({ ...prev, current: page, pageSize, total }));
      } catch (err) {
        console.error("Failed to fetch deductions", err);
        Toast.error("Failed to load deductions");
      } finally {
        setLoading(false);
      }
    },
    [Toast, pagination.current, pagination.pageSize, search]
  );

  useEffect(() => {
  fetchDeductions();
}, []);

  const handleSearch = (q) => {
    setSearch(q);
    setPagination((p) => ({ ...p, current: 1 }));
  };

  const createDeduction = async (payload) => {
    try {
      setLoading(true);
      const body = { ...payload, is_tax_exempt: false };
      const res = await deductionAPI.create(body);
      Toast.success("Deduction created");
      await fetchDeductions(1, pagination.pageSize, search);
      return res.data;
    } catch (err) {
      console.error("Create deduction failed", err);
      const msg = err?.response?.data
        ? (typeof err.response.data === "string" ? err.response.data : JSON.stringify(err.response.data))
        : "Failed to create deduction";
      Toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDeduction = async (id, payload) => {
    try {
      setLoading(true);
      const body = { ...payload, is_tax_exempt: false };
      const res = await deductionAPI.update(id, body);
      Toast.success("Deduction updated");
      await fetchDeductions(pagination.current, pagination.pageSize, search);
      return res.data;
    } catch (err) {
      console.error("Update deduction failed", err);
      const msg = err?.response?.data
        ? (typeof err.response.data === "string" ? err.response.data : JSON.stringify(err.response.data))
        : "Failed to update deduction";
      Toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDeduction = async (id) => {
    try {
      setLoading(true);
      await deductionAPI.delete(id);
      Toast.success("Deduction deleted");

      // fetch current page; if empty and page > 1, go to previous page
      const res = await deductionAPI.list({
        page: pagination.current,
        page_size: pagination.pageSize,
        ...(search ? { search } : {}),
      });
      const list = res?.data?.results ?? [];

      if (list.length === 0 && pagination.current > 1) {
        setPagination((p) => ({ ...p, current: p.current - 1 }));
      } else {
        setDeductions(list);
        setPagination((p) => ({ ...p, total: res?.data?.count ?? list.length }));
      }
    } catch (err) {
      console.error("Delete deduction failed", err);
      Toast.error("Failed to delete deduction");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deductions,
    loading,
    pagination,
    setPagination,
    fetchDeductions,
    handleSearch,
    createDeduction,
    updateDeduction,
    deleteDeduction,
  };
};
