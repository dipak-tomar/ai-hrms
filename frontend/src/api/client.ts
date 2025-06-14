import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
console.log('API_BASE_URL:', API_BASE_URL);

// Types for API responses and requests
export interface LoginResponse {
  user: User;
  token: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  hireDate?: string;
  status?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  totalHours: number | null;
  breakTime?: number;
  overtime?: number;
  status: string;
  notes?: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface AttendanceSummary {
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  workFromHomeDays?: number;
  totalDays: number;
  totalHours?: number;
  totalOvertime?: number;
}

export interface LeaveType {
  id: string;
  name: string;
  description?: string;
  maxDays: number;
  carryForward: boolean;
  isActive: boolean;
}

export interface LeaveBalance {
  leaveTypeId: string;
  leaveTypeName: string;
  maxDays: number;
  used: number;
  remaining: number;
  pending: number;
}

export interface LeaveApplication {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  appliedOn: string;
  approvedBy?: string;
  rejectedReason?: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  leaveType?: {
    id: string;
    name: string;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  status: string;
  color?: string;
}

export interface AllowanceItem {
  name: string;
  amount: number;
  description?: string;
}

export interface DeductionItem {
  name: string;
  amount: number;
  description?: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: AllowanceItem[];
  deductions: DeductionItem[];
  grossSalary: number;
  netSalary: number;
  taxAmount: number;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  generatedAt: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
  };
}

export interface PayrollReport {
  totalEmployees: number;
  totalPayroll: number;
  averageSalary: number;
  totalTax: number;
  totalAllowances: number;
  totalDeductions: number;
  payrollByDepartment?: {
    departmentName: string;
    employeeCount: number;
    totalSalary: number;
  }[];
}

export interface Payslip {
  payroll: Payroll;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    designation: string;
    department: {
      name: string;
    };
  };
  company: {
    name: string;
    address: string;
    logo?: string;
  };
}

export interface Goal {
  id: string;
  employeeId: string;
  title: string;
  description?: string;
  targetDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
  };
}

export interface PerformanceReview {
  id: string;
  revieweeId: string;
  reviewerId: string;
  revieweeUserId: string;
  reviewerUserId: string;
  period: string;
  overallRating: number;
  feedback?: string;
  goals?: Goal[];
  achievements?: Array<{
    id: string;
    title: string;
    description?: string;
    date: string;
  }>;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
  reviewee?: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  reviewer?: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
  };
}

export interface PerformanceMetrics {
  employeeId: string;
  averageRating: number;
  completedGoals: number;
  pendingGoals: number;
  reviewCount: number;
  latestReviewDate?: string;
  latestReviewRating?: number;
  employeeName?: string;
}

export interface TeamPerformance {
  departmentId: string;
  departmentName: string;
  averageRating: number;
  topPerformers: {
    employeeId: string;
    employeeName: string;
    rating: number;
  }[];
  improvementNeeded: {
    employeeId: string;
    employeeName: string;
    rating: number;
  }[];
  goalCompletionRate: number;
}

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
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: Record<string, unknown>): Promise<LoginResponse> => {
    console.log('authService.register called with:', userData);
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('authService.register error:', error);
      throw error;
    }
  },
  
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },
};

export const employeeService = {
  getEmployees: async (params?: Record<string, unknown>): Promise<Employee[]> => {
    const response = await apiClient.get('/employees', { params });
    return response.data;
  },
  
  getEmployee: async (id: string): Promise<Employee> => {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  },
  
  createEmployee: async (employeeData: Record<string, unknown>): Promise<Employee> => {
    const response = await apiClient.post('/employees', employeeData);
    return response.data;
  },
  
  updateEmployee: async (id: string, updates: Record<string, unknown>): Promise<Employee> => {
    const response = await apiClient.put(`/employees/${id}`, updates);
    return response.data;
  },
  
  deleteEmployee: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/employees/${id}`);
    return response.data;
  },
};

export const departmentService = {
  getDepartments: async (params?: Record<string, unknown>): Promise<Department[]> => {
    const response = await apiClient.get('/departments', { params });
    return response.data;
  },
  
  getDepartment: async (id: string): Promise<Department> => {
    const response = await apiClient.get(`/departments/${id}`);
    return response.data;
  },
  
  createDepartment: async (departmentData: Record<string, unknown>): Promise<Department> => {
    const response = await apiClient.post('/departments', departmentData);
    return response.data;
  },
  
  updateDepartment: async (id: string, updates: Record<string, unknown>): Promise<Department> => {
    const response = await apiClient.put(`/departments/${id}`, updates);
    return response.data;
  },
  
  deleteDepartment: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/departments/${id}`);
    return response.data;
  },
};

export const attendanceService = {
  getAttendance: async (params?: Record<string, string>): Promise<AttendanceRecord[]> => {
    const response = await apiClient.get('/attendance', { params });
    return response.data;
  },
  
  clockIn: async (notes?: string): Promise<{ attendance: AttendanceRecord }> => {
    const response = await apiClient.post('/attendance/clock-in', { notes });
    return response.data;
  },
  
  clockOut: async (data: { breakMinutes?: number, notes?: string }): Promise<{ attendance: AttendanceRecord }> => {
    const response = await apiClient.post('/attendance/clock-out', data);
    return response.data;
  },
  
  updateBreakTime: async (data: { attendanceId: string, breakMinutes: number }): Promise<AttendanceRecord> => {
    const response = await apiClient.post('/attendance/break', data);
    return response.data;
  },
  
  generateReport: async (data: { employeeId?: string, month: number, year: number }): Promise<AttendanceSummary> => {
    const response = await apiClient.post('/attendance/report', data);
    return response.data;
  },
};

export const leaveService = {
  // Leave Types
  getLeaveTypes: async (params?: Record<string, unknown>): Promise<LeaveType[]> => {
    const response = await apiClient.get('/leave/types', { params });
    return response.data;
  },
  
  getLeaveTypeById: async (id: string): Promise<LeaveType> => {
    const response = await apiClient.get(`/leave/types/${id}`);
    return response.data;
  },
  
  createLeaveType: async (data: Omit<LeaveType, 'id' | 'isActive'>): Promise<{ leaveType: LeaveType }> => {
    const response = await apiClient.post('/leave/types', data);
    return response.data;
  },
  
  updateLeaveType: async (id: string, data: Partial<LeaveType>): Promise<{ leaveType: LeaveType }> => {
    const response = await apiClient.put(`/leave/types/${id}`, data);
    return response.data;
  },
  
  deleteLeaveType: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/leave/types/${id}`);
    return response.data;
  },
  
  // Leave Applications
  getLeaveApplications: async (params?: Record<string, unknown>): Promise<LeaveApplication[]> => {
    const response = await apiClient.get('/leave/applications', { params });
    return response.data;
  },
  
  getLeaveApplicationById: async (id: string): Promise<LeaveApplication> => {
    const response = await apiClient.get(`/leave/applications/${id}`);
    return response.data;
  },
  
  applyForLeave: async (data: {
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    reason: string;
  }): Promise<{ leave: LeaveApplication }> => {
    const response = await apiClient.post('/leave/apply', data);
    return response.data;
  },
  
  updateLeaveApplication: async (
    id: string,
    data: { status: 'APPROVED' | 'REJECTED'; rejectedReason?: string }
  ): Promise<{ leave: LeaveApplication }> => {
    const response = await apiClient.put(`/leave/applications/${id}/approve-reject`, data);
    return response.data;
  },
  
  cancelLeaveApplication: async (id: string): Promise<{ leave: LeaveApplication }> => {
    const response = await apiClient.put(`/leave/applications/${id}/cancel`, {});
    return response.data;
  },
  
  // Leave Balance
  getLeaveBalance: async (params?: { year?: number }): Promise<LeaveBalance[]> => {
    const response = await apiClient.get('/leave/balance', { params });
    return response.data;
  },
  
  // Calendar
  getCalendarEvents: async (params: {
    startDate: string;
    endDate: string;
    employeeId?: string;
    departmentId?: string;
  }): Promise<CalendarEvent[]> => {
    const response = await apiClient.get('/leave/calendar', { params });
    return response.data;
  },
  
  generateCalendarLink: async (): Promise<{ url: string }> => {
    const response = await apiClient.get('/leave/calendar/link');
    return response.data;
  },
};

export const payrollService = {
  // Get all payrolls (HR/Admin only)
  getAllPayrolls: async (params?: {
    month?: number;
    year?: number;
    status?: string;
    employeeId?: string;
    departmentId?: string;
  }): Promise<Payroll[]> => {
    const response = await apiClient.get('/payroll', { params });
    return response.data;
  },
  
  // Get my payroll (for employees)
  getMyPayroll: async (params?: {
    month?: number;
    year?: number;
  }): Promise<Payroll[]> => {
    const response = await apiClient.get('/payroll/my', { params });
    return response.data;
  },
  
  // Get a specific payroll by ID
  getPayrollById: async (id: string): Promise<Payroll> => {
    const response = await apiClient.get(`/payroll/${id}`);
    return response.data;
  },
  
  // Create a single payroll
  createPayroll: async (data: {
    employeeId: string;
    month: number;
    year: number;
    basicSalary: number;
    allowances?: AllowanceItem[];
    deductions?: DeductionItem[];
  }): Promise<Payroll> => {
    const response = await apiClient.post('/payroll', data);
    return response.data;
  },
  
  // Update a payroll
  updatePayroll: async (id: string, data: {
    basicSalary?: number;
    allowances?: AllowanceItem[];
    deductions?: DeductionItem[];
    status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  }): Promise<Payroll> => {
    const response = await apiClient.put(`/payroll/${id}`, data);
    return response.data;
  },
  
  // Delete a payroll
  deletePayroll: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/payroll/${id}`);
    return response.data;
  },
  
  // Generate payrolls for a month
  generatePayrolls: async (data: {
    month: number;
    year: number;
    departmentId?: string;
  }): Promise<{ count: number; message: string }> => {
    const response = await apiClient.post('/payroll/generate', data);
    return response.data;
  },
  
  // Approve a payroll
  approvePayroll: async (id: string): Promise<Payroll> => {
    const response = await apiClient.post(`/payroll/${id}/approve`);
    return response.data;
  },
  
  // Mark a payroll as paid
  markAsPaid: async (id: string): Promise<Payroll> => {
    const response = await apiClient.post(`/payroll/${id}/pay`);
    return response.data;
  },
  
  // Generate a payslip
  generatePayslip: async (id: string): Promise<Payslip> => {
    const response = await apiClient.get(`/payroll/${id}/payslip`);
    return response.data;
  },
  
  // Get payroll report
  getPayrollReport: async (params: {
    month?: number;
    year?: number;
    departmentId?: string;
  }): Promise<PayrollReport> => {
    const response = await apiClient.get('/payroll/report', { params });
    return response.data;
  },
};

export const performanceService = {
  // Goals Management
  getMyGoals: async (): Promise<Goal[]> => {
    const response = await apiClient.get('/performance/goals/my');
    return response.data;
  },
  
  getEmployeeGoals: async (employeeId: string): Promise<Goal[]> => {
    const response = await apiClient.get(`/performance/employees/${employeeId}/goals`);
    return response.data;
  },
  
  getGoalById: async (id: string): Promise<Goal> => {
    const response = await apiClient.get(`/performance/goals/${id}`);
    return response.data;
  },
  
  createGoal: async (data: {
    employeeId: string;
    title: string;
    description?: string;
    targetDate: string;
    status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  }): Promise<Goal> => {
    const response = await apiClient.post('/performance/goals', data);
    return response.data;
  },
  
  updateGoal: async (id: string, data: {
    title?: string;
    description?: string;
    targetDate?: string;
    status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  }): Promise<Goal> => {
    const response = await apiClient.put(`/performance/goals/${id}`, data);
    return response.data;
  },
  
  deleteGoal: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/performance/goals/${id}`);
    return response.data;
  },
  
  // Performance Reviews
  getMyPerformanceReviews: async (): Promise<PerformanceReview[]> => {
    const response = await apiClient.get('/performance/reviews/my');
    return response.data;
  },
  
  getReviewsToComplete: async (): Promise<PerformanceReview[]> => {
    const response = await apiClient.get('/performance/reviews/to-complete');
    return response.data;
  },
  
  getPerformanceReviews: async (params?: {
    revieweeId?: string;
    reviewerId?: string;
    period?: string;
    status?: string;
  }): Promise<PerformanceReview[]> => {
    const response = await apiClient.get('/performance/reviews', { params });
    return response.data;
  },
  
  getPerformanceReviewById: async (id: string): Promise<PerformanceReview> => {
    const response = await apiClient.get(`/performance/reviews/${id}`);
    return response.data;
  },
  
  createPerformanceReview: async (data: {
    revieweeId: string;
    reviewerId: string;
    revieweeUserId: string;
    reviewerUserId: string;
    period: string;
    overallRating?: number;
    feedback?: string;
    goals?: Goal[];
    achievements?: Array<{
      id: string;
      title: string;
      description?: string;
      date: string;
    }>;
  }): Promise<PerformanceReview> => {
    const response = await apiClient.post('/performance/reviews', data);
    return response.data;
  },
  
  updatePerformanceReview: async (id: string, data: {
    overallRating?: number;
    feedback?: string;
    goals?: Goal[];
    achievements?: Array<{
      id: string;
      title: string;
      description?: string;
      date: string;
    }>;
    status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  }): Promise<PerformanceReview> => {
    const response = await apiClient.put(`/performance/reviews/${id}`, data);
    return response.data;
  },
  
  submitPerformanceReview: async (id: string): Promise<PerformanceReview> => {
    const response = await apiClient.post(`/performance/reviews/${id}/submit`);
    return response.data;
  },
  
  approvePerformanceReview: async (id: string): Promise<PerformanceReview> => {
    const response = await apiClient.post(`/performance/reviews/${id}/approve`);
    return response.data;
  },
  
  rejectPerformanceReview: async (id: string): Promise<PerformanceReview> => {
    const response = await apiClient.post(`/performance/reviews/${id}/reject`);
    return response.data;
  },
  
  deletePerformanceReview: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/performance/reviews/${id}`);
    return response.data;
  },
  
  // Performance Metrics
  getMyPerformanceMetrics: async (): Promise<PerformanceMetrics> => {
    const response = await apiClient.get('/performance/metrics/my');
    return response.data;
  },
  
  getEmployeePerformanceMetrics: async (employeeId: string): Promise<PerformanceMetrics> => {
    const response = await apiClient.get(`/performance/metrics/employees/${employeeId}`);
    return response.data;
  },
  
  getTeamPerformance: async (departmentId: string): Promise<TeamPerformance> => {
    const response = await apiClient.get(`/performance/metrics/departments/${departmentId}`);
    return response.data;
  },
};