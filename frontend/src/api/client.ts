import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
console.log('API_BASE_URL:', API_BASE_URL);

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    console.log('Making API request to:', config.url, 'with method:', config.method);
    console.log('Request data:', config.data);
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API response error:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service functions
export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: any) => {
    console.log('authService.register called with:', userData);
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('authService.register error:', error);
      throw error;
    }
  },
  
  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },
};

export const employeeService = {
  getEmployees: async (params?: any) => {
    const response = await apiClient.get('/employees', { params });
    return response.data;
  },
  
  getEmployee: async (id: string) => {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  },
  
  createEmployee: async (employeeData: any) => {
    const response = await apiClient.post('/employees', employeeData);
    return response.data;
  },
  
  updateEmployee: async (id: string, updates: any) => {
    const response = await apiClient.put(`/employees/${id}`, updates);
    return response.data;
  },
  
  deleteEmployee: async (id: string) => {
    const response = await apiClient.delete(`/employees/${id}`);
    return response.data;
  },
};

export const departmentService = {
  getDepartments: async (params?: any) => {
    const response = await apiClient.get('/departments', { params });
    return response.data;
  },
  
  getDepartment: async (id: string) => {
    const response = await apiClient.get(`/departments/${id}`);
    return response.data;
  },
  
  createDepartment: async (departmentData: any) => {
    const response = await apiClient.post('/departments', departmentData);
    return response.data;
  },
  
  updateDepartment: async (id: string, updates: any) => {
    const response = await apiClient.put(`/departments/${id}`, updates);
    return response.data;
  },
  
  deleteDepartment: async (id: string) => {
    const response = await apiClient.delete(`/departments/${id}`);
    return response.data;
  },
};