import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, Calendar, UserCheck, AlertTriangle, 
  Target, Clock, BarChart3,
  Filter, Download, RefreshCw, AlertCircle, UserX,
  Activity, Settings
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  BarChart, Bar, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';
import Card from '../components/Card';
import Button from '../components/Button';
import AttritionRiskCard from '../components/analytics/AttritionRiskCard';
import PerformanceInsightChart from '../components/analytics/PerformanceInsightChart';
import { useAnalytics } from '../hooks/useAnalytics';



type TabType = 'overview' | 'attrition' | 'performance' | 'leave' | 'attendance';

const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isInitialized, setIsInitialized] = useState(false);
  const [filters, setFilters] = useState({
    departmentId: '',
    period: 'MONTH',
    dateFrom: '',
    dateTo: ''
  });

  const {
    dashboard,
    attritionRisks,
    performanceInsights,
    leavePatterns,
    attendanceAnomalies,
    isLoading,
    hasErrors,
    insights,
    loadAllAnalytics,
    exportAnalyticsReport,
    acknowledgeAlert,
    resolveAlert,
    startAutoRefresh,
    stopAutoRefresh,
    isAutoRefreshActive
  } = useAnalytics();

  // Load initial data
  useEffect(() => {
    if (!isInitialized) {
      loadAllAnalytics();
      startAutoRefresh(300000); // 5 minutes
      setIsInitialized(true);
    }

    return () => {
      stopAutoRefresh();
    };
  }, [isInitialized]); // Only depend on initialization flag

  const handleRefresh = () => {
    loadAllAnalytics();
  };

  const handleExport = async () => {
    try {
      await exportAnalyticsReport(filters, 'PDF');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleViewEmployeeDetails = (employeeId: string) => {
    // Navigate to employee detail page
    console.log('View employee details:', employeeId);
  };

  const handleTakeAction = (employeeId: string, action: string) => {
    // Handle various actions for employees
    console.log('Take action:', action, 'for employee:', employeeId);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'attrition', label: 'Attrition Risk', icon: AlertTriangle },
    { id: 'performance', label: 'Performance Insights', icon: Target },
    { id: 'leave', label: 'Leave Patterns', icon: Calendar },
    { id: 'attendance', label: 'Attendance Anomalies', icon: Clock }
  ];

  // Mock data for leave patterns (would come from backend)
  const leavePatternData = [
    { month: 'Jan', sickLeave: 12, vacationLeave: 8, personalLeave: 3 },
    { month: 'Feb', sickLeave: 15, vacationLeave: 6, personalLeave: 4 },
    { month: 'Mar', sickLeave: 10, vacationLeave: 12, personalLeave: 2 },
    { month: 'Apr', sickLeave: 8, vacationLeave: 15, personalLeave: 5 },
    { month: 'May', sickLeave: 18, vacationLeave: 20, personalLeave: 3 },
    { month: 'Jun', sickLeave: 14, vacationLeave: 25, personalLeave: 6 }
  ];

  const attendanceAnomalyData = [
    { type: 'Frequent Late', count: 8, severity: 'HIGH' },
    { type: 'Early Departures', count: 5, severity: 'MEDIUM' },
    { type: 'Irregular Hours', count: 12, severity: 'MEDIUM' },
    { type: 'Absenteeism', count: 3, severity: 'HIGH' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Smart Analytics</h1>
          <p className="text-text-secondary">AI-powered insights and predictive analytics for HR decision making</p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Auto Refresh: {isAutoRefreshActive ? 'ON' : 'OFF'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Insights Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm text-text-secondary">Critical Risk</p>
              <p className="text-2xl font-bold text-red-600">{insights.criticalAttritionRisk}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-orange-500">
          <div className="flex items-center gap-3">
            <UserX className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-text-secondary">Low Performers</p>
              <p className="text-2xl font-bold text-orange-600">{insights.lowPerformers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-sm text-text-secondary">Burnout Risk</p>
              <p className="text-2xl font-bold text-yellow-600">{insights.highBurnoutRisk}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-text-secondary">Active Alerts</p>
              <p className="text-2xl font-bold text-blue-600">{insights.totalActiveAlerts}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Department</label>
            <select
              value={filters.departmentId}
              onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })}
              className="border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Departments</option>
              <option value="eng">Engineering</option>
              <option value="sales">Sales</option>
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Period</label>
            <select
              value={filters.period}
              onChange={(e) => setFilters({ ...filters, period: e.target.value })}
              className="border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="WEEK">Last Week</option>
              <option value="MONTH">Last Month</option>
              <option value="QUARTER">Last Quarter</option>
              <option value="YEAR">Last Year</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => loadAllAnalytics()}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Dashboard Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="p-4">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-primary" />
                <div className="ml-3">
                  <p className="text-sm text-text-secondary">Total Employees</p>
                  <p className="text-2xl font-semibold">{dashboard?.overview.totalEmployees || 0}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center">
                <UserCheck className="w-8 h-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm text-text-secondary">Active</p>
                  <p className="text-2xl font-semibold">{dashboard?.overview.activeEmployees || 0}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm text-text-secondary">Attendance Rate</p>
                  <p className="text-2xl font-semibold">{dashboard?.overview.averageAttendanceRate?.toFixed(1) || 0}%</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm text-text-secondary">Performance</p>
                  <p className="text-2xl font-semibold">{dashboard?.overview.averagePerformanceScore?.toFixed(1) || 0}%</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm text-text-secondary">Turnover Rate</p>
                  <p className="text-2xl font-semibold">8.2%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* System Alerts */}
          {dashboard?.alerts && dashboard.alerts.length > 0 && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  System Alerts
                </h3>
                <div className="space-y-3">
                  {dashboard.alerts.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        alert.severity === 'CRITICAL' ? 'border-red-500 bg-red-50' :
                        alert.severity === 'HIGH' ? 'border-orange-500 bg-orange-50' :
                        alert.severity === 'MEDIUM' ? 'border-yellow-500 bg-yellow-50' :
                        'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-text-primary">{alert.message}</p>
                          <p className="text-sm text-text-secondary">
                            {new Date(alert.timestamp).toLocaleDateString()} {new Date(alert.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => acknowledgeAlert(alert.id)}
                          >
                            Acknowledge
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => resolveAlert(alert.id)}
                          >
                            Resolve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'attrition' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {attritionRisks.map((employee) => (
              <AttritionRiskCard
                key={employee.employeeId}
                employee={employee}
                onViewDetails={handleViewEmployeeDetails}
                onTakeAction={handleTakeAction}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <PerformanceInsightChart
          insights={performanceInsights}
          departmentFilter={filters.departmentId}
        />
      )}

      {activeTab === 'leave' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leave Patterns Chart */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Leave Patterns by Month</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={leavePatternData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="month" stroke="#6B778C" fontSize={12} />
                      <YAxis stroke="#6B778C" fontSize={12} />
                      <Tooltip />
                      <Area type="monotone" dataKey="sickLeave" stackId="1" stroke="#FF5630" fill="#FF5630" />
                      <Area type="monotone" dataKey="vacationLeave" stackId="1" stroke="#36B37E" fill="#36B37E" />
                      <Area type="monotone" dataKey="personalLeave" stackId="1" stroke="#0052CC" fill="#0052CC" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>

            {/* Burnout Risk Analysis */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Burnout Risk Analysis</h3>
                <div className="space-y-4">
                  {leavePatterns.slice(0, 5).map((pattern) => (
                    <div key={pattern.employeeId} className="p-3 bg-surface rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{pattern.employeeName}</div>
                          <div className="text-sm text-text-secondary">{pattern.department}</div>
                        </div>
                        <div className="text-right">
                          <div className={`px-2 py-1 text-xs rounded-full ${
                            pattern.burnoutRisk === 'HIGH' ? 'bg-red-100 text-red-800' :
                            pattern.burnoutRisk === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {pattern.burnoutRisk} RISK
                          </div>
                          <div className="text-sm text-text-secondary mt-1">
                            {pattern.totalLeaveDays} days
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Anomalies Chart */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Attendance Anomaly Types</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceAnomalyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="type" stroke="#6B778C" fontSize={12} />
                      <YAxis stroke="#6B778C" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#FF5630" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>

            {/* Attendance Issues List */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Employees Needing Attention</h3>
                <div className="space-y-3">
                  {attendanceAnomalies.slice(0, 5).map((anomaly) => (
                    <div key={anomaly.employeeId} className="p-3 bg-surface rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{anomaly.employeeName}</div>
                          <div className="text-sm text-text-secondary">{anomaly.department}</div>
                          <div className="text-sm text-text-primary mt-1">
                            Score: {anomaly.attendanceScore}%
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs rounded-full ${getRiskLevelColor(anomaly.riskLevel)}`}>
                            {anomaly.riskLevel}
                          </span>
                          <div className="text-sm text-text-secondary mt-1">
                            {anomaly.anomalies.length} issues
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage; 