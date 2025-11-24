// src/services/paymentHistoryServices.js
import API from "../api";

export const paymentHistoryAPI = {
  getByMonth: async (month) => {
    console.log("Fetching payment for:", month);

    // ---- Dummy response (replace API.get with actual backend later) ----
    return Promise.resolve({
      data: [
        {
          id: 1,
          employee_name: "John Doe",
          pay_grade: "Grade A",
          net_salary: 45000,
          to_be_paid: 45000,
        },
        {
          id: 2,
          employee_name: "Jane Smith",
          pay_grade: "Grade B",
          net_salary: 38000,
          to_be_paid: 35000,
        },
      ],
    });

    // When real API arrives:
    // return API.get(`/payroll/history/?month=${month}`);
  },
};
