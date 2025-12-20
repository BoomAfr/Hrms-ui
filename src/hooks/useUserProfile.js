import { useState, useEffect, useCallback } from 'react';
import { userProfileAPI } from '../services/userProfileServices';
import { message } from 'antd';

export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userProfileAPI.getProfile();
      setProfile(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err);
      message.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const response = await userProfileAPI.updateProfile(data);
      setProfile(prev => ({ ...prev, profile: response.data }));
      message.success('Profile updated successfully');
      return response.data;
    } catch (err) {
      console.error('Error updating profile:', err);
      message.error(err.response?.data?.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
};
