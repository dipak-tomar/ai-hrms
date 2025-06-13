import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

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
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
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
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
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