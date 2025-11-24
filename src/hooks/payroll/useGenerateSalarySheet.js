// src/hooks/payroll/useSalarySheet.js
import { useCallback, useEffect, useState } from "react";
import { salarySheetAPI } from "../../services/Payroll/generateSalarySheetServices";
import { useToast } from "../../hooks/useToast";

export const useSalarySheet = () => {
  const { Toast } = useToast();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [filters, setFilters] = useState({
    month: "",
    status: "",
  });

  const fetch = useCallback(
    async (page = pagination.current, pageSize = pagination.pageSize, f = filters) => {
      try {
        setLoading(true);

        const params = { page, page_size: pageSize };
        if (f.month) params.month = f.month;
        if (f.status) params.status = f.status;

        const res = await salarySheetAPI.list(params);

        const results = res?.data?.results ?? res?.data ?? [];
        const total = res?.data?.count ?? results.length;

        setRows(results);
        setPagination((p) => ({ ...p, current: page, pageSize, total }));
      } catch (err) {
        console.error("Failed to fetch salary sheet", err);
        Toast.error("Failed to load salary sheet");
      } finally {
        setLoading(false);
      }
    },
    [Toast, pagination.current, pagination.pageSize, filters]
  );

  useEffect(() => {
    fetch(pagination.current, pagination.pageSize, filters);
  }, [ pagination.current, pagination.pageSize, filters.month, filters.status]);

  const handleFilter = ({ month, status }) => {
  setPagination(prev => ({ ...prev, current: 1 }));
  setFilters(prev => ({
    ...prev,
    month,
    status,
  }));
};

  const generatePayslip = async ({ employee_id, month }) => {
    try {
      setLoading(true);
      const res = await salarySheetAPI.generatePayslip({ employee_id, month });
      const payslipId = res?.data?.payslip_id ?? null;

      Toast.success("Payslip generated successfully");
      await fetch(pagination.current, pagination.pageSize, filters);

      return payslipId;
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data ||
        "Failed to generate payslip";
      Toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    rows,
    loading,
    pagination,
    setPagination,
    filters,
    handleFilter,
    generatePayslip,
    fetchSalarySheet: fetch,
  };
};
