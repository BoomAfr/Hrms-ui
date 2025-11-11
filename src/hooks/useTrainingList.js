import { useState, useEffect } from "react";
import { employeeTrainingAPI } from "../services/trainingListServices"

export const useEmployeeTrainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const response = await employeeTrainingAPI.getAll();
      setTrainings(response.data.results);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addTraining = async (data) => {
    try {
      const response = await employeeTrainingAPI.create(data);
      setTrainings((prev) => [...prev, response.data]);
    } catch (err) {
      setError(err);
    }
  };

  const updateTraining = async (id, data) => {
    try {
      const response = await employeeTrainingAPI.update(id, data);
      setTrainings((prev) =>
        prev.map((item) => (item.id === id ? response.data : item))
      );
    } catch (err) {
      setError(err);
    }
  };

  const deleteTraining = async (id) => {
    try {
      await employeeTrainingAPI.delete(id);
      setTrainings((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  return {
    trainings,
    loading,
    error,
    addTraining,
    updateTraining,
    deleteTraining,
  };
};