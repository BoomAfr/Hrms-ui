import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT, HTTP_STATUS } from '../constants/apiConstants';
import { STORAGE_KEYS } from '../constants/appConstants';
import store from '../store';
import { logout } from '../store/slices/authSlice';
const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Request interceptor with logging
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else if (config.data) {
      config.headers['Content-Type'] = 'application/json';
    }
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);


API.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    const { config, response } = error;
    
    console.error('API Response Error:', {
      url: config?.url,
      status: response?.status,
      data: response?.data,
      message: error.message
    });
    
    // ✅ Specific handling for 404 errors
    if (response?.status === HTTP_STATUS.NOT_FOUND) {
      const errorMessage = `Resource not found: ${config?.url}`;
      console.warn('404 Error:', errorMessage);
      
      // Custom 404 error object create karein
      const customError = new Error(errorMessage);
      customError.status = 404;
      customError.url = config?.url;
      customError.is404 = true;
      
      return Promise.reject(customError);
    }
    
    // ✅ Handle other errors
    if (response?.status === HTTP_STATUS.UNAUTHORIZED) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem('hrms_access_token');
      localStorage.removeItem('hrms_refresh_token');
      
      // Redux store se logout dispatch karein
      store.dispatch(logout());
      
      // window.location.href = '/login'; // Temporary comment
    }
    
    // ✅ Always return a proper error object
    const enhancedError = new Error(
      response?.data?.message || 
      response?.data?.detail || 
      error.message || 
      'Request failed'
    );
    enhancedError.status = response?.status;
    enhancedError.data = response?.data;
    
    return Promise.reject(enhancedError);
  }
);

export default API;