import { useEffect, useState, useCallback } from "react";
import {
  getEmployees,
  getPerformanceCategories,
  getPerformanceCriteria,
  getEmployeePerformanceList,
  deleteEmployeePerformance,
} from "../services/employeePerfomanceServices";

export const usePerformanceModule = () => {
  const [listLoading, setListLoading] = useState(false);
  const [performanceList, setPerformanceList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [criteria, setCriteria] = useState([]);

  const loadDropdowns = useCallback(async () => {
    try {
      const [emps, cats, crits] = await Promise.all([
        getEmployees(),
        getPerformanceCategories(),
        getPerformanceCriteria(),
      ]);

      const employeesNormalized = Array.isArray(emps) ? emps : (emps.results || []);

setEmployees(
  employeesNormalized.map((e) => ({
    id: e.user_id || e.id,   
    name: e.full_name || e.name || e.username,
  }))
);

      // categories & criteria are assumed arrays
      setCategories(Array.isArray(cats) ? cats : (cats.results || []));
      setCriteria(Array.isArray(crits) ? crits : (crits.results || []));
    } catch (err) {
      console.error("Error loading dropdowns:", err);
    }
  }, []);

  useEffect(() => {
    loadDropdowns();
  }, [loadDropdowns]);

  // load list with search & pagination
  const loadPerformance = useCallback(
    async (search = "", pg = 1, pgSize = pageSize) => {
      try {
        setListLoading(true);
        const res = await getEmployeePerformanceList(search, pg, pgSize);
        // expected response: paginated { results: [...], count: N }
        const data = res.data || res;
        const results = data.results || data;
        setPerformanceList(results);
        setTotal(data.count ?? results.length ?? 0);
        setPage(pg);
        setPageSize(pgSize);
      } catch (err) {
        console.error("Error loading performance list:", err);
      } finally {
        setListLoading(false);
      }
    },
    [pageSize]
  );

  const removePerformance = async (id) => {
    await deleteEmployeePerformance(id);
    // reload current page
    loadPerformance("", page, pageSize);
  };

  return {
    // list
    listLoading,
    performanceList,
    total,
    page,
    pageSize,
    loadPerformance,
    setPage,
    setPageSize,
    removePerformance,

    // dropdowns
    employees,
    categories,
    criteria,

    // helper
    loadDropdowns,
  };
};
