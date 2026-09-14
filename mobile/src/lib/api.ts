import axios from 'axios';
import { API_BASE_URL, API_VERSION } from './constants';

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
  requestId?: string;
}

const apiClient = axios.create({
  baseURL: API_VERSION ? `${API_BASE_URL}/${API_VERSION}` : API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const errorData = error.response.data || {};
      return Promise.reject({
        message: errorData.error?.message || error.message || 'An error occurred',
        code: errorData.error?.code || 'UNKNOWN_ERROR',
        status: error.response.status,
        details: errorData.error?.details || {},
        requestId: errorData.error?.request_id,
      } satisfies ApiError);
    }
    if (error.request) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
        status: 0,
      } satisfies ApiError);
    }
    return Promise.reject({
      message: error.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      status: 0,
    } satisfies ApiError);
  }
);

export default apiClient;
