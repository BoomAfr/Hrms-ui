import { useState, useEffect } from "react";
import { taxRuleAPI } from "../../services/Payroll/taxRuleSetupServices";

export const useTaxRules = () => {
  const [maleRules, setMaleRules] = useState([]);
  const [femaleRules, setFemaleRules] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const res = await taxRuleAPI.getAll();
      setMaleRules(res.data.male_rules);
      setFemaleRules(res.data.female_rules);
    } finally {
      setLoading(false);
    }
  };

  const updateRules = async () => {
    const merged = [...maleRules, ...femaleRules];
    await taxRuleAPI.updateAll(merged);
    fetchRules();
  };

  useEffect(() => {
    fetchRules();
  }, []);

  return {
    maleRules,
    femaleRules,
    setMaleRules,
    setFemaleRules,
    loading,
    updateRules,
  };
};
