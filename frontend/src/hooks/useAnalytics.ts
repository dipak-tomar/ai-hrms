import { useState, useEffect, useCallback } from 'react';
import { 
  AnalyticsService, 
  AttritionRiskScore, 
  PerformanceInsight, 
  LeavePatternAnalysis, 
  AttendanceAnomalyDetection, 
  DashboardAnalytics,
  AnalyticsFilterDto,
  AttritionRiskFilterDto,
  PerformanceInsightFilterDto,
  LeavePatternFilterDto,
  AttendanceAnomalyFilterDto
} from '../api/analytics';

export interface AnalyticsState {
  dashboard: DashboardAnalytics | null;
  attritionRisks: AttritionRiskScore[];
  performanceInsights: PerformanceInsight[];
  leavePatterns: LeavePatternAnalysis[];
  attendanceAnomalies: AttendanceAnomalyDetection[];
  loading: {
    dashboard: boolean;
    attritionRisks: boolean;
    performanceInsights: boolean;
    leavePatterns: boolean;
    attendanceAnomalies: boolean;
  };
  error: {
    dashboard: string | null;
    attritionRisks: string | null;
    performanceInsights: string | null;
    leavePatterns: string | null;
    attendanceAnomalies: string | null;
  };
  lastUpdated: {
    dashboard: Date | null;
    attritionRisks: Date | null;
    performanceInsights: Date | null;
    leavePatterns: Date | null;
    attendanceAnomalies: Date | null;
  };
}

const initialState: AnalyticsState = {
  dashboard: null,
  attritionRisks: [],
  performanceInsights: [],
  leavePatterns: [],
  attendanceAnomalies: [],
  loading: {
    dashboard: false,
    attritionRisks: false,
    performanceInsights: false,
    leavePatterns: false,
    attendanceAnomalies: false,
  },
  error: {
    dashboard: null,
    attritionRisks: null,
    performanceInsights: null,
    leavePatterns: null,
    attendanceAnomalies: null,
  },
  lastUpdated: {
    dashboard: null,
    attritionRisks: null,
    performanceInsights: null,
    leavePatterns: null,
    attendanceAnomalies: null,
  },
};

export const useAnalytics = () => {
  const [state, setState] = useState<AnalyticsState>(initialState);

  // Dashboard Analytics
  const loadDashboardAnalytics = useCallback(async (filters: AnalyticsFilterDto = {}) => {
    setState(prev => ({ 
      ...prev, 
      loading: { ...prev.loading, dashboard: true },
      error: { ...prev.error, dashboard: null }
    }));

    try {
      const data = await AnalyticsService.getDashboardAnalytics(filters);
      setState(prev => ({ 
        ...prev, 
        dashboard: data,
        loading: { ...prev.loading, dashboard: false },
        lastUpdated: { ...prev.lastUpdated, dashboard: new Date() }
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, dashboard: false },
        error: { ...prev.error, dashboard: error instanceof Error ? error.message : 'Unknown error' }
      }));
    }
  }, []);

  // Attrition Risk Analysis
  const loadAttritionRisks = useCallback(async (filters: AttritionRiskFilterDto = {}) => {
    setState(prev => ({ 
      ...prev, 
      loading: { ...prev.loading, attritionRisks: true },
      error: { ...prev.error, attritionRisks: null }
    }));

    try {
      const data = await AnalyticsService.getAttritionRisk(filters);
      setState(prev => ({ 
        ...prev, 
        attritionRisks: data,
        loading: { ...prev.loading, attritionRisks: false },
        lastUpdated: { ...prev.lastUpdated, attritionRisks: new Date() }
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, attritionRisks: false },
        error: { ...prev.error, attritionRisks: error instanceof Error ? error.message : 'Unknown error' }
      }));
    }
  }, []);

  // Performance Insights
  const loadPerformanceInsights = useCallback(async (filters: PerformanceInsightFilterDto = {}) => {
    setState(prev => ({ 
      ...prev, 
      loading: { ...prev.loading, performanceInsights: true },
      error: { ...prev.error, performanceInsights: null }
    }));

    try {
      const data = await AnalyticsService.getPerformanceInsights(filters);
      setState(prev => ({ 
        ...prev, 
        performanceInsights: data,
        loading: { ...prev.loading, performanceInsights: false },
        lastUpdated: { ...prev.lastUpdated, performanceInsights: new Date() }
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, performanceInsights: false },
        error: { ...prev.error, performanceInsights: error instanceof Error ? error.message : 'Unknown error' }
      }));
    }
  }, []);

  // Leave Pattern Analysis
  const loadLeavePatterns = useCallback(async (filters: LeavePatternFilterDto = {}) => {
    setState(prev => ({ 
      ...prev, 
      loading: { ...prev.loading, leavePatterns: true },
      error: { ...prev.error, leavePatterns: null }
    }));

    try {
      const data = await AnalyticsService.getLeavePatternAnalysis(filters);
      setState(prev => ({ 
        ...prev, 
        leavePatterns: data,
        loading: { ...prev.loading, leavePatterns: false },
        lastUpdated: { ...prev.lastUpdated, leavePatterns: new Date() }
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, leavePatterns: false },
        error: { ...prev.error, leavePatterns: error instanceof Error ? error.message : 'Unknown error' }
      }));
    }
  }, []);

  // Attendance Anomaly Detection
  const loadAttendanceAnomalies = useCallback(async (filters: AttendanceAnomalyFilterDto = {}) => {
    setState(prev => ({ 
      ...prev, 
      loading: { ...prev.loading, attendanceAnomalies: true },
      error: { ...prev.error, attendanceAnomalies: null }
    }));

    try {
      const data = await AnalyticsService.getAttendanceAnomalies(filters);
      setState(prev => ({ 
        ...prev, 
        attendanceAnomalies: data,
        loading: { ...prev.loading, attendanceAnomalies: false },
        lastUpdated: { ...prev.lastUpdated, attendanceAnomalies: new Date() }
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: { ...prev.loading, attendanceAnomalies: false },
        error: { ...prev.error, attendanceAnomalies: error instanceof Error ? error.message : 'Unknown error' }
      }));
    }
  }, []);

  // Load all analytics data
  const loadAllAnalytics = useCallback(async (
    dashboardFilters: AnalyticsFilterDto = {},
    attritionFilters: AttritionRiskFilterDto = {},
    performanceFilters: PerformanceInsightFilterDto = {},
    leaveFilters: LeavePatternFilterDto = {},
    attendanceFilters: AttendanceAnomalyFilterDto = {}
  ) => {
    await Promise.all([
      loadDashboardAnalytics(dashboardFilters),
      loadAttritionRisks(attritionFilters),
      loadPerformanceInsights(performanceFilters),
      loadLeavePatterns(leaveFilters),
      loadAttendanceAnomalies(attendanceFilters)
    ]);
  }, [loadDashboardAnalytics, loadAttritionRisks, loadPerformanceInsights, loadLeavePatterns, loadAttendanceAnomalies]);

  // Employee-specific analytics
  const loadEmployeeAnalytics = useCallback(async (employeeId: string) => {
    try {
      const summary = await AnalyticsService.getEmployeeAnalyticsSummary(employeeId);
      return summary;
    } catch (error) {
      console.error('Failed to load employee analytics:', error);
      throw error;
    }
  }, []);

  // Export analytics report
  const exportAnalyticsReport = useCallback(async (
    filters: AnalyticsFilterDto = {}, 
    format: 'PDF' | 'EXCEL' = 'PDF'
  ) => {
    try {
      await AnalyticsService.exportAnalyticsReport(filters, format);
    } catch (error) {
      console.error('Failed to export analytics report:', error);
      throw error;
    }
  }, []);

  // Acknowledge alert
  const acknowledgeAlert = useCallback(async (alertId: string) => {
    try {
      await AnalyticsService.acknowledgeAlert(alertId);
      // Refresh dashboard data to update alert status
      await loadDashboardAnalytics();
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
      throw error;
    }
  }, [loadDashboardAnalytics]);

  // Resolve alert
  const resolveAlert = useCallback(async (alertId: string) => {
    try {
      await AnalyticsService.resolveAlert(alertId);
      // Refresh dashboard data to update alert status
      await loadDashboardAnalytics();
    } catch (error) {
      console.error('Failed to resolve alert:', error);
      throw error;
    }
  }, [loadDashboardAnalytics]);

  // Clear errors
  const clearError = useCallback((section: keyof AnalyticsState['error']) => {
    setState(prev => ({
      ...prev,
      error: { ...prev.error, [section]: null }
    }));
  }, []);

  // Clear all data
  const clearAllData = useCallback(() => {
    setState(initialState);
  }, []);

  // Auto-refresh functionality
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const startAutoRefresh = useCallback((intervalMs: number = 300000) => { // Default 5 minutes
    setAutoRefreshInterval(prevInterval => {
      if (prevInterval) {
        clearInterval(prevInterval);
      }

      const interval = setInterval(() => {
        loadDashboardAnalytics();
      }, intervalMs);

      return interval;
    });
  }, [loadDashboardAnalytics]);

  const stopAutoRefresh = useCallback(() => {
    setAutoRefreshInterval(prevInterval => {
      if (prevInterval) {
        clearInterval(prevInterval);
      }
      return null;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
      }
    };
  }, [autoRefreshInterval]);

  // Computed values
  const isLoading = Object.values(state.loading).some(loading => loading);
  const hasErrors = Object.values(state.error).some(error => error !== null);

  // High-level analytics insights
  const insights = {
    criticalAttritionRisk: state.attritionRisks.filter(emp => emp.riskLevel === 'CRITICAL').length,
    highAttritionRisk: state.attritionRisks.filter(emp => emp.riskLevel === 'HIGH').length,
    lowPerformers: state.performanceInsights.filter(emp => emp.overallScore < 70).length,
    decliningPerformance: state.performanceInsights.filter(emp => emp.ratingTrend === 'DECLINING').length,
    highBurnoutRisk: state.leavePatterns.filter(emp => emp.burnoutRisk === 'HIGH').length,
    attendanceIssues: state.attendanceAnomalies.filter(emp => emp.riskLevel === 'HIGH').length,
    totalActiveAlerts: state.dashboard?.alerts.filter(alert => alert.status === 'ACTIVE').length || 0,
    criticalAlerts: state.dashboard?.alerts.filter(alert => alert.severity === 'CRITICAL' && alert.status === 'ACTIVE').length || 0
  };

  return {
    // State
    ...state,
    isLoading,
    hasErrors,
    insights,

    // Actions
    loadDashboardAnalytics,
    loadAttritionRisks,
    loadPerformanceInsights,
    loadLeavePatterns,
    loadAttendanceAnomalies,
    loadAllAnalytics,
    loadEmployeeAnalytics,
    exportAnalyticsReport,
    acknowledgeAlert,
    resolveAlert,
    clearError,
    clearAllData,

    // Auto-refresh
    startAutoRefresh,
    stopAutoRefresh,
    isAutoRefreshActive: autoRefreshInterval !== null
  };
}; 