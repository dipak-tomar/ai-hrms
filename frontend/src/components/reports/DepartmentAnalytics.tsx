import React, { useState, useEffect } from 'react';
import { Users, Download, Filter, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { reportsService, DepartmentAnalyticsData, ReportFilters } from '../../api/reports';
import toast from 'react-hot-toast';

const DepartmentAnalytics: React.FC = () => {
  const [reportData, setReportData] = useState<DepartmentAnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    try {
      const data = await reportsService.getDepartmentAnalytics(filters);
      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate department analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ReportFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    setExporting(true);
    try {
      const blob = await reportsService.exportDepartmentAnalytics(filters, format);
      const filename = `department-analytics-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      reportsService.downloadFile(blob, filename);
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  const getPerformanceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (rate: number) => {
    if (rate >= 90) return 'bg-green-100 text-green-800';
    if (rate >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getPerformanceLabel = (rate: number) => {
    if (rate >= 90) return 'Excellent';
    if (rate >= 75) return 'Good';
    return 'Needs Improvement';
  };

  // Calculate overall statistics
  const overallStats = reportData ? {
    totalEmployees: reportData.analytics.reduce((sum, dept) => sum + dept.totalEmployees, 0),
    avgAttendanceRate: reportData.analytics.reduce((sum, dept) => sum + dept.attendanceRate, 0) / reportData.analytics.length,
    avgLeaveUtilization: reportData.analytics.reduce((sum, dept) => sum + dept.avgLeaveUtilization, 0) / reportData.analytics.length,
    totalDepartments: reportData.analytics.length
  } : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Department Analytics</h2>
          <p className="text-gray-600">Analyze department-wise performance and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleExport('excel')}
            disabled={exporting || !reportData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Excel
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={exporting || !reportData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Overall Statistics Cards */}
      {overallStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Departments</p>
                <p className="text-2xl font-semibold text-gray-900">{overallStats.totalDepartments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Employees</p>
                <p className="text-2xl font-semibold text-gray-900">{overallStats.totalEmployees}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Avg Attendance</p>
                <p className="text-2xl font-semibold text-gray-900">{overallStats.avgAttendanceRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Avg Leave Usage</p>
                <p className="text-2xl font-semibold text-gray-900">{overallStats.avgLeaveUtilization.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Department Analytics Cards */}
      {reportData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportData.analytics.map((department) => (
            <div key={department.departmentId} className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{department.departmentName}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceBadge(department.attendanceRate)}`}>
                  {getPerformanceLabel(department.attendanceRate)}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total Employees</span>
                  <span className="text-sm font-medium text-gray-900">{department.totalEmployees}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Attendance Rate</span>
                  <span className={`text-sm font-medium ${getPerformanceColor(department.attendanceRate)}`}>
                    {department.attendanceRate.toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Leave Utilization</span>
                  <span className="text-sm font-medium text-gray-900">{department.avgLeaveUtilization.toFixed(1)}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Attendance Records</span>
                  <span className="text-sm font-medium text-gray-900">{department.totalAttendanceRecords}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Leave Applications</span>
                  <span className="text-sm font-medium text-gray-900">{department.totalLeaveApplications}</span>
                </div>
                
                {/* Progress bars */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Attendance</span>
                      <span>{department.attendanceRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${department.attendanceRate >= 90 ? 'bg-green-500' : department.attendanceRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(department.attendanceRate, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Leave Usage</span>
                      <span>{department.avgLeaveUtilization.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${Math.min(department.avgLeaveUtilization, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Data Table */}
      {reportData && (
        <div className="bg-white rounded-lg border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Department Performance Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employees
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Utilization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Records
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.analytics.map((department) => (
                  <tr key={department.departmentId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {department.departmentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {department.totalEmployees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={getPerformanceColor(department.attendanceRate)}>
                        {department.attendanceRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {department.avgLeaveUtilization.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {department.totalAttendanceRecords}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {department.totalLeaveApplications}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceBadge(department.attendanceRate)}`}>
                        {getPerformanceLabel(department.attendanceRate)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Generating analytics...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && reportData && reportData.analytics.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No department data found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to see more data.</p>
        </div>
      )}
    </div>
  );
};

export default DepartmentAnalytics;