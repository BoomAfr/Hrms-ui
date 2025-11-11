import { useState, useEffect } from "react";
import { workShiftAPI } from "../services/manageWorkShiftServices";
export const useWorkShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await workShiftAPI.getAll();
      console.log(response)
      setShifts(response.data.results);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addShift = async (data) => {
    try {
      const response = await workShiftAPI.create(data);
      setShifts((prev) => [...prev, response.data]);
    } catch (err) {
      setError(err);
    }
  };

  const updateShift = async (id, data) => {
    try {
      const response = await workShiftAPI.update(id, data);
      setShifts((prev) => prev.map((item) => (item.id === id ? response.data : item)));
    } catch (err) {
      setError(err);
    }
  };

  const deleteShift = async (id) => {
    try {
      await workShiftAPI.delete(id);
      setShifts((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  return { shifts, loading, error, addShift, updateShift, deleteShift, refetch: fetchShifts };
};