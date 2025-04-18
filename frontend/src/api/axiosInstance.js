import axios from 'axios';
import Cookies from 'js-cookie';

// Determine the base URL based on environment
const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
console.log('API URL:', API_URL);

// Create axios instance with production-ready configuration
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Increased timeout for production network conditions
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to handle authentication and request preparation
axiosInstance.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching issues in some browsers
    config.params = {
      ...config.params,
      _t: Date.now()
    };
    
    // Add auth token to headers if available
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Log request errors to help with debugging in production
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common API responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear invalid token
      Cookies.remove('token');
      
      // Redirect to login page
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Handle server errors with useful messages
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response?.data || error.message);
    }
    
    // Network errors handling for offline scenarios
    if (error.message === 'Network Error') {
      console.log('Network connection issue. Please check your internet connection.');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;