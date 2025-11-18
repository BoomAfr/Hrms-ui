import { useState, useEffect } from "react";
import { earnLeaveAPI } from "..//services/earnLeaveConfigureServices";

const useEarnLeave = (Toast) => {
  const [days, setDays] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ruleId, setRuleId] = useState(null);


  useEffect(() => {
    const fetchRule = async () => {
      try {
        const res = await earnLeaveAPI.getAll();
        let month1Rule;

        // if backend returns an array
        if (Array.isArray(res.data)) {
          month1Rule = res.data.find((rule) => rule.for_month === 1);
        } else if (res.data.results && Array.isArray(res.data.results)) {
          // if backend returns { results: [...] }
          month1Rule = res.data.results.find((rule) => rule.for_month === 1);
        } else {
          // if backend returns a single object
          month1Rule = res.data.for_month === 1 ? res.data : null;
        }

        if (month1Rule) {
          setRuleId(month1Rule.id);
          setDays(month1Rule.day_of_earn_leave);
        }
      } catch (err) {
        console.error("Fetch rule error:", err);
      }
    };
    fetchRule();
  }, []);

  const handleUpdate = async () => {
    if (!ruleId) return;
    if (days === "" || isNaN(days) || Number(days) < 0) return;

    setLoading(true);
    try {
      const res = await earnLeaveAPI.put(ruleId, { day_of_earn_leave: Number(days) });
      Toast.success("Earn Leave Updated Successfully");
      console.log("Update response:", res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      Toast.error("Failed to update Earn Leave");
      console.error("Put error:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return { days, setDays, loading, success, handleUpdate };
};

export default useEarnLeave;