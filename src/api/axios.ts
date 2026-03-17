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
        const status = error.response?.status;
        
        // Handle 401 Unauthorized - redirect to login
        if (status === 401) {
            // Clear authentication data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Show message
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = '/auth/login';
            }, 1500);
            
            return Promise.reject(error);
        }
        
        // Skip toast for 404 (handled by component)
        if (status === 404) {
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
        const status = error.response?.status;
        
        // Handle 401 Unauthorized - redirect to login
        if (status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
            return Promise.reject(error);
        }
        
        const message = error.response?.data?.message
            || error.message
            || 'Tải lên thất bại. Vui lòng thử lại.';
        
        toast.error(message);
        return Promise.reject(error);
    }
);
