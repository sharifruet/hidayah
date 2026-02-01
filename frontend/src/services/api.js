import axios from 'axios';
import { API_BASE_URL, API_VERSION } from '../utils/constants.js';

/**
 * Create axios instance with base configuration
 */
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens or headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 */
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data || {};
      const errorMessage = errorData.error?.message || error.message || 'An error occurred';
      const errorCode = errorData.error?.code || 'UNKNOWN_ERROR';

      return Promise.reject({
        message: errorMessage,
        code: errorCode,
        status: error.response.status,
        details: errorData.error?.details || {},
        requestId: errorData.error?.request_id
      });
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
        status: 0
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        status: 0
      });
    }
  }
);

export default apiClient;
