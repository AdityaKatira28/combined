import axios from 'axios';

// Get API base URL from environment variables or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized access
        console.error('Unauthorized access - please log in');
        // You might want to redirect to login page or refresh token here
      } else if (error.response.status === 403) {
        // Handle forbidden access
        console.error('Access forbidden');
      } else if (error.response.status === 404) {
        // Handle not found
        console.error('Resource not found');
      } else if (error.response.status >= 500) {
        // Handle server errors
        console.error('Server error occurred');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Compliance API
export const complianceApi = {
  // Get compliance checks with optional filters
  getComplianceChecks: async (filters?: { status?: string; severity?: string }) => {
    try {
      const response = await api.get('/compliance/checks', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching compliance checks:', error);
      throw error;
    }
  },

  // Get compliance dashboard summary
  getComplianceSummary: async () => {
    try {
      const response = await api.get('/compliance/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching compliance summary:', error);
      throw error;
    }
  },

  // Get AI insights
  getAiInsights: async () => {
    try {
      const response = await api.get('/compliance/insights');
      return response.data;
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      throw error;
    }
  },

  // Run compliance scan
  runComplianceScan: async (resources: string[]) => {
    try {
      const response = await api.post('/compliance/scan', { resources });
      return response.data;
    } catch (error) {
      console.error('Error running compliance scan:', error);
      throw error;
    }
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export default api;
