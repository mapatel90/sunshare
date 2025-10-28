'use client'
import { useState, useEffect } from 'react';
import { showSuccessToast, showErrorToast } from '@/utils/topTost';
import { apiGet, apiPost } from '@/lib/api';

const useSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth token from localStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  };

  // Fetch all settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        console.warn('No authentication token found, skipping settings fetch');
        setSettings({});
        setLoading(false);
        return {};
      }

      const data = await apiGet('/api/settings');
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch settings');
      }

      setSettings(data.data || {});
      return data.data;
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err.message);
      // Only show error toast for actual API errors, not missing tokens
      if (!err.message.includes('authentication token')) {
        showErrorToast(`Error fetching settings: ${err.message}`);
      }
      return {};
    } finally {
      setLoading(false);
    }
  };

  // Update multiple settings
  const updateSettings = async (settingsData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const data = await apiPost('/api/settings/bulk', settingsData);
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update settings');
      }

      // Update local settings state
      setSettings(prev => ({ ...prev, ...settingsData }));
      
      showSuccessToast('Settings updated successfully!');
      return data.data;
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err.message);
      showErrorToast(`Error updating settings: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update single setting
  const updateSetting = async (key, value) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const data = await apiPost('/api/settings', { key, value });
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update setting');
      }

      // Update local settings state
      setSettings(prev => ({ ...prev, [key]: value }));
      
      showSuccessToast('Setting updated successfully!');
      return data.data;
    } catch (err) {
      console.error('Error updating setting:', err);
      setError(err.message);
      showErrorToast(`Error updating setting: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single setting value
  const getSetting = (key, defaultValue = '') => {
    return settings[key] || defaultValue;
  };

  // Load settings on component mount
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchSettings();
    } else {
      setLoading(false);
      setSettings({});
    }
  }, []);

  // Method to refresh settings (useful after login)
  const refreshSettings = async () => {
    const token = getAuthToken();
    if (token) {
      return await fetchSettings();
    } else {
      setSettings({});
      setLoading(false);
      return {};
    }
  };

  return {
    settings,
    loading,
    error,
    fetchSettings,
    refreshSettings,
    updateSettings,
    updateSetting,
    getSetting,
  };
};

export default useSettings;