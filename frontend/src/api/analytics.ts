// Analytics API service for Smart Analytics features
import { apiClient } from './client';

// Types for Analytics API responses
export interface AttritionRiskScore {
  employeeId: string;
  employeeName: string;
  department: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: AttritionRiskFactor[];
  recommendations: string[];
  lastUpdated: Date;
}

export interface AttritionRiskFactor {
  factor: string;
  weight: number;
  value: number;
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  description: string;
}

export interface PerformanceInsight {
  employeeId: string;
  employeeName: string;
  department: string;
  overallScore: number;
  goalCompletionRate: number;
  strengthAreas: string[];
  improvementAreas: string[];
  ratingTrend: 'IMPROVING' | 'DECLINING' | 'STABLE';
  recommendations: string[];
  benchmarkComparison: BenchmarkComparison;
}

export interface BenchmarkComparison {
  departmentAverage: number;
  companyAverage: number;
  percentile: number;
}

export interface LeavePatternAnalysis {
  employeeId: string;
  employeeName: string;
  department: string;
  totalLeaveDays: number;
  leaveFrequency: number;
  averageLeaveDuration: number;
  leaveTypes: LeaveTypeUsage[];
  seasonalPatterns: SeasonalLeavePattern[];
  anomalies: LeaveAnomaly[];
  burnoutRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendations: string[];
}

export interface LeaveTypeUsage {
  leaveType: string;
  daysUsed: number;
  frequency: number;
  percentage: number;
}

export interface SeasonalLeavePattern {
  month: number;
  monthName: string;
  days: number;
  frequency: number;
  averageDays: number;
}

export interface LeaveAnomaly {
  type: string;
  description: string;
  frequency: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  dateRange: {
    start: Date;
    end: Date;
  };
  impact: string;
}

export interface AttendanceAnomalyDetection {
  employeeId: string;
  employeeName: string;
  department: string;
  anomalies: AttendanceAnomaly[];
  attendanceScore: number;
  patterns: AttendancePattern[];
  recommendations: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface AttendanceAnomaly {
  type: string;
  description: string;
  frequency: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  dateRange: {
    start: Date;
    end: Date;
  };
  impact: string;
}

export interface AttendancePattern {
  pattern: string;
  frequency: number;
  description: string;
  isPositive: boolean;
}

export interface DashboardAnalytics {
  overview: OverviewMetrics;
  attendance: AttendanceMetrics;
  leave: LeaveMetrics;
  performance: PerformanceMetrics;
  recruitment: RecruitmentMetrics;
  attrition: AttritionMetrics;
  trends: TrendAnalysis;
  alerts: SystemAlert[];
}

export interface OverviewMetrics {
  totalEmployees: number;
  activeEmployees: number;
  averageAttendanceRate: number;
  averagePerformanceScore: number;
  totalDepartments: number;
  pendingRequests: number;
  recentHires: number;
  upcomingReviews: number;
}

export interface AttendanceMetrics {
  todayAttendance: number;
  averageAttendanceRate: number;
  lateArrivals: number;
  earlyDepartures: number;
  workFromHome: number;
  onLeave: number;
  attendanceTrend: TrendData[];
  departmentAttendance: DepartmentAttendance[];
}

export interface LeaveMetrics {
  totalLeavesTaken: number;
  averageLeaveDuration: number;
  mostUsedLeaveType: string;
  upcomingLeaves: number;
  leaveBalance: number;
  leavesTrend: TrendData[];
  leaveTypeDistribution: LeaveTypeDistribution[];
}

export interface PerformanceMetrics {
  averageRating: number;
  goalCompletionRate: number;
  topPerformers: number;
  improvementNeeded: number;
  pendingReviews: number;
  performanceTrend: TrendData[];
  departmentPerformance: DepartmentPerformance[];
}

export interface RecruitmentMetrics {
  activePositions: number;
  applicationsReceived: number;
  interviewsScheduled: number;
  offersExtended: number;
  hiredThisMonth: number;
  timeToHire: number;
  recruitmentFunnel: RecruitmentFunnelData[];
}

export interface AttritionMetrics {
  attritionRate: number;
  voluntaryAttrition: number;
  involuntaryAttrition: number;
  averageAttritionRisk: number;
  highRiskEmployees: number;
  departmentAttrition: DepartmentAttrition[];
  attritionTrend: TrendData[];
}

export interface TrendAnalysis {
  attendanceTrend: TrendData[];
  performanceTrend: TrendData[];
  leaveTrend: TrendData[];
  attritionTrend: TrendData[];
  recruitmentTrend: TrendData[];
}

export interface TrendData {
  period: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'stable';
}

export interface SystemAlert {
  id: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  department?: string;
  employeeCount?: number;
  timestamp: Date;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  actionRequired: boolean;
}

// Additional supporting interfaces
export interface DepartmentAttendance {
  departmentId: string;
  departmentName: string;
  attendanceRate: number;
  presentCount: number;
  totalCount: number;
}

export interface LeaveTypeDistribution {
  leaveType: string;
  count: number;
  percentage: number;
  averageDuration: number;
}

export interface DepartmentPerformance {
  departmentId: string;
  departmentName: string;
  averageRating: number;
  goalCompletionRate: number;
  employeeCount: number;
}

export interface RecruitmentFunnelData {
  stage: string;
  count: number;
  conversionRate: number;
}

export interface DepartmentAttrition {
  departmentId: string;
  departmentName: string;
  attritionRate: number;
  departures: number;
  totalEmployees: number;
}

// Filter types for API requests
export interface AttritionRiskFilterDto {
  departmentId?: string;
  employeeId?: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  minRiskScore?: number;
  maxRiskScore?: number;
  includeInactive?: boolean;
}

export interface PerformanceInsightFilterDto {
  departmentId?: string;
  employeeId?: string;
  ratingRange?: {
    min: number;
    max: number;
  };
  goalCompletionThreshold?: number;
  includeInactive?: boolean;
}

export interface LeavePatternFilterDto {
  departmentId?: string;
  employeeId?: string;
  leaveType?: string;
  burnoutRisk?: 'LOW' | 'MEDIUM' | 'HIGH';
  anomalyType?: string;
  includeInactive?: boolean;
}

export interface AttendanceAnomalyFilterDto {
  departmentId?: string;
  employeeId?: string;
  anomalyType?: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  attendanceThreshold?: number;
  includeInactive?: boolean;
}

export interface AnalyticsFilterDto {
  departmentId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  period?: 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';
}

// Analytics API service class
export class AnalyticsService {
  // Attrition Risk Analysis
  static async getAttritionRisk(filters: AttritionRiskFilterDto = {}): Promise<AttritionRiskScore[]> {
    const queryParams = new URLSearchParams();
    
    if (filters.departmentId) queryParams.append('departmentId', filters.departmentId);
    if (filters.employeeId) queryParams.append('employeeId', filters.employeeId);
    if (filters.riskLevel) queryParams.append('riskLevel', filters.riskLevel);
    if (filters.minRiskScore) queryParams.append('minRiskScore', filters.minRiskScore.toString());
    if (filters.maxRiskScore) queryParams.append('maxRiskScore', filters.maxRiskScore.toString());
    if (filters.includeInactive) queryParams.append('includeInactive', filters.includeInactive.toString());

    const response = await apiClient.get(`/analytics/attrition-risk?${queryParams.toString()}`);
    return response.data.data;
  }

  // Performance Insights
  static async getPerformanceInsights(filters: PerformanceInsightFilterDto = {}): Promise<PerformanceInsight[]> {
    const queryParams = new URLSearchParams();
    
    if (filters.departmentId) queryParams.append('departmentId', filters.departmentId);
    if (filters.employeeId) queryParams.append('employeeId', filters.employeeId);
    if (filters.ratingRange) {
      queryParams.append('minRating', filters.ratingRange.min.toString());
      queryParams.append('maxRating', filters.ratingRange.max.toString());
    }
    if (filters.goalCompletionThreshold) {
      queryParams.append('goalCompletionThreshold', filters.goalCompletionThreshold.toString());
    }
    if (filters.includeInactive) queryParams.append('includeInactive', filters.includeInactive.toString());

    const response = await apiClient.get(`/analytics/performance-insights?${queryParams.toString()}`);
    return response.data.data;
  }

  // Leave Pattern Analysis
  static async getLeavePatternAnalysis(filters: LeavePatternFilterDto = {}): Promise<LeavePatternAnalysis[]> {
    const queryParams = new URLSearchParams();
    
    if (filters.departmentId) queryParams.append('departmentId', filters.departmentId);
    if (filters.employeeId) queryParams.append('employeeId', filters.employeeId);
    if (filters.leaveType) queryParams.append('leaveType', filters.leaveType);
    if (filters.burnoutRisk) queryParams.append('burnoutRisk', filters.burnoutRisk);
    if (filters.anomalyType) queryParams.append('anomalyType', filters.anomalyType);
    if (filters.includeInactive) queryParams.append('includeInactive', filters.includeInactive.toString());

    const response = await apiClient.get(`/analytics/leave-patterns?${queryParams.toString()}`);
    return response.data.data;
  }

  // Attendance Anomaly Detection
  static async getAttendanceAnomalies(filters: AttendanceAnomalyFilterDto = {}): Promise<AttendanceAnomalyDetection[]> {
    const queryParams = new URLSearchParams();
    
    if (filters.departmentId) queryParams.append('departmentId', filters.departmentId);
    if (filters.employeeId) queryParams.append('employeeId', filters.employeeId);
    if (filters.anomalyType) queryParams.append('anomalyType', filters.anomalyType);
    if (filters.riskLevel) queryParams.append('riskLevel', filters.riskLevel);
    if (filters.attendanceThreshold) {
      queryParams.append('attendanceThreshold', filters.attendanceThreshold.toString());
    }
    if (filters.includeInactive) queryParams.append('includeInactive', filters.includeInactive.toString());

    const response = await apiClient.get(`/analytics/attendance-anomalies?${queryParams.toString()}`);
    return response.data.data;
  }

  // Dashboard Analytics
  static async getDashboardAnalytics(filters: AnalyticsFilterDto = {}): Promise<DashboardAnalytics> {
    const queryParams = new URLSearchParams();
    
    if (filters.departmentId) queryParams.append('departmentId', filters.departmentId);
    if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom.toISOString());
    if (filters.dateTo) queryParams.append('dateTo', filters.dateTo.toISOString());
    if (filters.period) queryParams.append('period', filters.period);

    const response = await apiClient.get(`/analytics/dashboard?${queryParams.toString()}`);
    return response.data.data;
  }

  // Employee Analytics Summary (for individual employee analysis)
  static async getEmployeeAnalyticsSummary(employeeId: string) {
    const response = await apiClient.get(`/analytics/employee/${employeeId}/summary`);
    return response.data.data;
  }

  // Export Analytics Report
  static async exportAnalyticsReport(filters: AnalyticsFilterDto = {}, format: 'PDF' | 'EXCEL' = 'PDF') {
    const queryParams = new URLSearchParams();
    
    if (filters.departmentId) queryParams.append('departmentId', filters.departmentId);
    if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom.toISOString());
    if (filters.dateTo) queryParams.append('dateTo', filters.dateTo.toISOString());
    if (filters.period) queryParams.append('period', filters.period);
    queryParams.append('format', format);

    const response = await apiClient.get(`/analytics/export?${queryParams.toString()}`, {
      responseType: 'blob'
    });
    
    // Create download link
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Real-time Analytics (for dashboard updates)
  static async getRealTimeMetrics() {
    const response = await apiClient.get('/analytics/real-time');
    return response.data.data;
  }

  // Acknowledge System Alert
  static async acknowledgeAlert(alertId: string) {
    const response = await apiClient.patch(`/analytics/alerts/${alertId}/acknowledge`);
    return response.data;
  }

  // Resolve System Alert
  static async resolveAlert(alertId: string) {
    const response = await apiClient.patch(`/analytics/alerts/${alertId}/resolve`);
    return response.data;
  }
}

export default AnalyticsService; 