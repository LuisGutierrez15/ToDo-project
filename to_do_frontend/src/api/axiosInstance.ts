import axios, { AxiosError } from "axios";
import { env } from "../config/env";

/**
 * Configured Axios instance for API requests.
 * Includes base URL, timeout, headers, and error handling.
 */
export const axiosInstance = axios.create({
  baseURL: `${env.API_BASE_URL}/todos`,
  timeout: env.API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for debugging in development
if (env.IS_DEVELOPMENT) {
  axiosInstance.interceptors.request.use(
    (config) => {
      console.debug('API Request:', config.method?.toUpperCase(), config.url, config.params);
      return config;
    },
    (error) => {
      console.error('API Request Error:', error);
      return Promise.reject(error);
    }
  );
}

// Response interceptor for centralized error handling
axiosInstance.interceptors.response.use(
  (response) => {
    if (env.IS_DEVELOPMENT) {
      console.debug('API Response:', response.status, response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    if (env.IS_DEVELOPMENT) {
      console.error('API Error:', error.response?.status, error.response?.data);
    }
    
    // Handle common HTTP errors
    if (error.response?.status === 401) {
      console.warn('Unauthorized access - consider implementing auth');
    } else if (error.response?.status && error.response.status >= 500) {
      console.error('Server error - please try again later');
    }
    
    return Promise.reject(error);
  }
);
