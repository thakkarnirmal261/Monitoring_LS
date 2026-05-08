import axios from 'axios';

// In development: use relative paths (Vite proxy forwards to backend)
// In production: use full URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Fetch metrics data from the monitoring server
export const fetchMetrics = async () => {
  try {
    const response = await apiClient.get('/metrics');
    return response.data;
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
};

// Optional: Trigger metrics collection manually
export const triggerMetrics = async () => {
  try {
    const response = await apiClient.get('/trigger');
    return response.data;
  } catch (error) {
    console.error('Error triggering metrics:', error);
    throw error;
  }
};

export default apiClient;
