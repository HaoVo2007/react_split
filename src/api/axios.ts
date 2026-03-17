import axios from "axios";
import toast from 'react-hot-toast';
import { API_URL } from '../config/env';

/**
 * Axios API Client
 * 
 * Pre-configured axios instance with:
 * - Base URL from environment variables
 * - Request/Response interceptors
 * - Authentication token handling
 * - Error toast notifications
 */

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Add request interceptor to include token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to show toast for all API errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Skip toast for certain status codes if needed
        const status = error.response?.status;
        
        // Don't show toast for 401 (handled by auth logic) or 404 (handled by component)
        if (status === 401 || status === 404) {
            return Promise.reject(error);
        }

        // Get error message from response or use default
        const message = error.response?.data?.message
            || error.message
            || 'Đã xảy ra lỗi. Vui lòng thử lại.';

        // Show toast notification
        toast.error(message);

        // Reject the promise so the error can still be handled by the caller
        return Promise.reject(error);
    }
);

/**
 * Upload API Client
 * 
 * Separate instance for file uploads with different headers
 */
export const uploadApi = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

uploadApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Don't set Content-Type for FormData - let browser set it with boundary
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

uploadApi.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message
            || error.message
            || 'Tải lên thất bại. Vui lòng thử lại.';
        
        toast.error(message);
        return Promise.reject(error);
    }
);
