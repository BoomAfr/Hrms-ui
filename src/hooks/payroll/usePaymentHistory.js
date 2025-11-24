// src/hooks/usePaymentHistory.js
import { useState } from "react";
import { paymentHistoryAPI } from "../../services/Payroll/paymentHistoryServices";
import { useToast } from "../../hooks/useToast";

export const usePaymentHistory = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(null);
  const [data, setData] = useState([]);

  const fetchPaymentHistory = async () => {
    if (!month) {
      showToast("Please select a month", "warning");
      return;
    }

    try {
      setLoading(true);
      const response = await paymentHistoryAPI.getByMonth(month);
      setData(response.data);
    } catch (error) {
      showToast("Failed to fetch payment history", "error");
    } finally {
      setLoading(false);
    }
  };

  const totals = data.reduce(
    (acc, row) => {
      acc.net_salary += row.net_salary;
      acc.to_be_paid += row.to_be_paid;
      return acc;
    },
    { net_salary: 0, to_be_paid: 0 }
  );

  return {
    loading,
    month,
    setMonth,
    data,
    fetchPaymentHistory,
    totals,
  };
};
