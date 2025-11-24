import { useState, useEffect } from "react";
import { bonusSettingAPI } from "../../services/Payroll/bonusSettingServices";
import { useToast } from "../../hooks/useToast";

export const useBonusSetting = () => {
  const [bonusList, setBonusList] = useState([]);
  const [loading, setLoading] = useState(false);
  //const { showSuccess, showError } = useToast();

  const fetchBonus = async () => {
    try {
      setLoading(true);
      const res = await bonusSettingAPI.getAll();
      setBonusList(res.data);
    } catch (err) {
      //showError("Failed to fetch bonuses");
    } finally {
      setLoading(false);
    }
  };

  const createBonus = async (data) => {
    try {
      await bonusSettingAPI.create(data);
      //showSuccess("Bonus added successfully");
      fetchBonus();
    } catch (err) {
      //showError("Failed to create bonus");
      throw err;
    }
  };

  const updateBonus = async (id, data) => {
    try {
      await bonusSettingAPI.update(id, data);
      //showSuccess("Bonus updated successfully");
      fetchBonus();
    } catch (err) {
      //showError("Failed to update bonus");
      throw err;
    }
  };

  const deleteBonus = async (id) => {
    try {
      await bonusSettingAPI.delete(id);
      //showSuccess("Bonus deleted");
      fetchBonus();
    } catch (err) {
      //showError("Failed to delete bonus");
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
