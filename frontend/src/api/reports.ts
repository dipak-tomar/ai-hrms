import { apiClient } from './client';

export interface ReportFilters {
  employeeId?: string;
  departmentId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  leaveType?: string;
  month?: number;
  year?: number;
}

export interface AttendanceReportData {
  title: string;
  statistics: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    totalHours: number;
    overtimeHours: number;
  };
  records: Array<{
    id: string;
    employeeName: string;
    department: string;
    date: string;
    clockIn: string | null;
    clockOut: string | null;
    status: string;
    totalHours: number;
    overtimeHours: number;
    isLate: boolean;
  }>;
}

export interface LeaveReportData {
  title: string;
  statistics: {
    totalApplications: number;
    approvedLeaves: number;
    rejectedLeaves: number;
    pendingLeaves: number;
    totalDaysTaken: number;
    utilizationRate: number;
  };
  records: Array<{
    id: string;
    employeeName: string;
    department: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    status: string;
    reason: string;
    appliedDate: string;
  }>;
}

export interface PerformanceReportData {
  title: string;
  reviews: Array<{
    id: string;
    employeeName: string;
    department: string;
    reviewerName: string;
    reviewPeriod: string;
    overallRating: number;
    status: string;
    goalsCount: number;
    completedGoals: number;
    strengths: string;
    areasForImprovement: string;
  }>;
}

export interface PayrollReportData {
  title: string;
  period: string;
  totals: {
    totalGrossSalary: number;
    totalDeductions: number;
    totalNetSalary: number;
    totalTax: number;
    totalEmployees: number;
  };
  records: Array<{
    id: string;
    employeeName: string;
    department: string;
    basicSalary: number;
    allowances: number;
    grossSalary: number;
    deductions: number;
    totalDeductions: number;
    tax: number;
    netSalary: number;
    status: string;
    payDate: string | null;
  }>;
}

export interface DepartmentAnalyticsData {
  title: string;
  analytics: Array<{
    departmentId: string;
    departmentName: string;
    totalEmployees: number;
    attendanceRate: number;
    avgLeaveUtilization: number;
    totalAttendanceRecords: number;
    totalLeaveApplications: number;
  }>;
}

export interface CustomReportRequest {
  title: string;
  reportType: 'attendance' | 'leave' | 'payroll' | 'department';
  filters: ReportFilters;
  columns: string[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  format?: 'json' | 'excel' | 'pdf';
}

export interface CustomReportData {
  title: string;
  type: string;
  columns: string[];
  data: Record<string, unknown>[];
  generatedAt: string;
  generatedBy: string;
}

class ReportsService {
  // Employee Reports
  async getAttendanceReport(filters: ReportFilters = {}): Promise<AttendanceReportData> {
    const params = new URLSearchParams();
    
    if (filters.employeeId) params.append('employeeId', filters.employeeId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const response = await apiClient.get(`/reports/employees/attendance?${params.toString()}`);
    return response.data;
  }

  async getLeaveReport(filters: ReportFilters = {}): Promise<LeaveReportData> {
    const params = new URLSearchParams();
    
    if (filters.employeeId) params.append('employeeId', filters.employeeId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const response = await apiClient.get(`/reports/employees/leave?${params.toString()}`);
    return response.data;
  }

  async getPerformanceReport(filters: ReportFilters = {}): Promise<PerformanceReportData> {
    const params = new URLSearchParams();
    
    if (filters.employeeId) params.append('employeeId', filters.employeeId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const response = await apiClient.get(`/reports/employees/performance?${params.toString()}`);
    return response.data;
  }

  // Department Analytics
  async getDepartmentAnalytics(filters: ReportFilters = {}): Promise<DepartmentAnalyticsData> {
    const params = new URLSearchParams();
    
    if (filters.departmentId) params.append('departmentId', filters.departmentId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const response = await apiClient.get(`/reports/departments/analytics?${params.toString()}`);
    return response.data;
  }

  // Payroll Reports
  async getPayrollReport(filters: ReportFilters = {}): Promise<PayrollReportData> {
    const params = new URLSearchParams();
    
    if (filters.employeeId) params.append('employeeId', filters.employeeId);
    if (filters.month) params.append('month', filters.month.toString());
    if (filters.year) params.append('year', filters.year.toString());
    
    const response = await apiClient.get(`/reports/payroll?${params.toString()}`);
    return response.data;
  }

  // Custom Report Builder
  async generateCustomReport(request: CustomReportRequest): Promise<CustomReportData> {
    const response = await apiClient.post('/reports/custom', request);
    return response.data;
  }

  // Export Functions
  async exportAttendanceReport(filters: ReportFilters, format: 'excel' | 'pdf'): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters.employeeId) params.append('employeeId', filters.employeeId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    params.append('format', format);
    
    const response = await apiClient.get(`/reports/employees/attendance?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async exportLeaveReport(filters: ReportFilters, format: 'excel' | 'pdf'): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters.employeeId) params.append('employeeId', filters.employeeId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    params.append('format', format);
    
    const response = await apiClient.get(`/reports/employees/leave?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async exportPayrollReport(filters: ReportFilters, format: 'excel' | 'pdf'): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters.employeeId) params.append('employeeId', filters.employeeId);
    if (filters.month) params.append('month', filters.month.toString());
    if (filters.year) params.append('year', filters.year.toString());
    params.append('format', format);
    
    const response = await apiClient.get(`/reports/payroll?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async exportDepartmentAnalytics(filters: ReportFilters, format: 'excel' | 'pdf'): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters.departmentId) params.append('departmentId', filters.departmentId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    params.append('format', format);
    
    const response = await apiClient.get(`/reports/departments/analytics?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Utility function to download blob as file
  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export const reportsService = new ReportsService(); 