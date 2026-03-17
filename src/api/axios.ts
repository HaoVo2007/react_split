import axios from "axios";
import toast from 'react-hot-toast';

export const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Add request interceptor to include token if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to show toast for all API errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Get error message from response or use default
        const message = error.response?.data?.message
            || error.message
            || 'An error occurred. Please try again.';

        // Show toast notification
        toast.error(message);

        // Reject the promise so the error can still be handled by the caller
        return Promise.reject(error);
    }
);