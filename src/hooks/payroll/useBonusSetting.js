import { useState, useEffect } from "react";
import { bonusSettingAPI } from "../../services/Payroll/bonusSettingServices";

export const useBonusSetting = () => {
  const [bonusList, setBonusList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBonus = async () => {
    try {
      setLoading(true);
      const res = await bonusSettingAPI.getAll();
      setBonusList(res.data.results); 
    } catch (err) {
      console.error("Failed to fetch bonuses", err);
    } finally {
      setLoading(false);
    }
  };

  const createBonus = async (data) => {
    try {
      await bonusSettingAPI.create(data);
      fetchBonus();
    } catch (err) {
      throw err;
    }
  };

  const updateBonus = async (id, data) => {
    try {
      await bonusSettingAPI.update(id, data);
      fetchBonus();
    } catch (err) {
      throw err;
    }
  };

  const deleteBonus = async (id) => {
    try {
      await bonusSettingAPI.delete(id);
      fetchBonus();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchBonus();
  }, []);

  return {
    bonusList,
    loading,
    createBonus,
    updateBonus,
    deleteBonus,
  };
};