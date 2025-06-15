import React, { useState, useEffect } from 'react';
import { Filter, Download, Plus, X, Settings, FileText } from 'lucide-react';
import { reportsService, CustomReportRequest, CustomReportData, ReportFilters } from '../../api/reports';
import { employeeService } from '../../api/client';
import toast from 'react-hot-toast';

const CustomReportBuilder: React.FC = () => {
  const [reportData, setReportData] = useState<CustomReportData | null>(null);
  const [employees, setEmployees] = useState<Array<{id: string; firstName: string; lastName: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [reportConfig, setReportConfig] = useState<CustomReportRequest>({
    title: 'Custom Report',
    reportType: 'attendance',
    filters: {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    },
    columns: ['employeeName', 'department', 'date'],
    dateRange: {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    }
  });

  const reportTypes = [
    { value: 'attendance', label: 'Attendance Report' },
    { value: 'leave', label: 'Leave Report' },
    { value: 'payroll', label: 'Payroll Report' },
    { value: 'department', label: 'Department Analytics' }
  ] as const;

  const availableColumns: Record<'attendance' | 'leave' | 'payroll' | 'department', Array<{value: string; label: string}>> = {
    attendance: [
      { value: 'employeeName', label: 'Employee Name' },
      { value: 'department', label: 'Department' },
      { value: 'date', label: 'Date' },
      { value: 'clockIn', label: 'Clock In' },
      { value: 'clockOut', label: 'Clock Out' },
      { value: 'totalHours', label: 'Total Hours' },
      { value: 'status', label: 'Status' },
      { value: 'overtimeHours', label: 'Overtime Hours' }
    ],
    leave: [
      { value: 'employeeName', label: 'Employee Name' },
      { value: 'department', label: 'Department' },
      { value: 'leaveType', label: 'Leave Type' },
      { value: 'startDate', label: 'Start Date' },
      { value: 'endDate', label: 'End Date' },
      { value: 'totalDays', label: 'Total Days' },
      { value: 'status', label: 'Status' },
      { value: 'reason', label: 'Reason' }
    ],
    payroll: [
      { value: 'employeeName', label: 'Employee Name' },
      { value: 'department', label: 'Department' },
      { value: 'basicSalary', label: 'Basic Salary' },
      { value: 'allowances', label: 'Allowances' },
      { value: 'grossSalary', label: 'Gross Salary' },
      { value: 'deductions', label: 'Deductions' },
      { value: 'tax', label: 'Tax' },
      { value: 'netSalary', label: 'Net Salary' },
      { value: 'status', label: 'Status' }
    ],
    department: [
      { value: 'departmentName', label: 'Department Name' },
      { value: 'totalEmployees', label: 'Total Employees' },
      { value: 'attendanceRate', label: 'Attendance Rate' },
      { value: 'avgLeaveUtilization', label: 'Leave Utilization' },
      { value: 'totalAttendanceRecords', label: 'Attendance Records' },
      { value: 'totalLeaveApplications', label: 'Leave Applications' }
    ]
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await employeeService.getEmployees();
      // Ensure response is always an array
      setEmployees(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error loading employees:', error);
      setEmployees([]); // Set empty array on error
    }
  };

  const generateReport = async () => {
    if (reportConfig.columns.length === 0) {
      toast.error('Please select at least one column');
      return;
    }

    setLoading(true);
    try {
      const data = await reportsService.generateCustomReport(reportConfig);
      setReportData(data);
      toast.success('Custom report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate custom report');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (key: keyof CustomReportRequest, value: string | string[] | ReportFilters) => {
    setReportConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleFilterChange = (key: keyof ReportFilters, value: string | number) => {
    setReportConfig(prev => ({
      ...prev,
      filters: { ...prev.filters, [key]: value }
    }));
  };

  const handleDateRangeChange = (key: 'startDate' | 'endDate', value: string) => {
    setReportConfig(prev => ({
      ...prev,
      dateRange: { ...prev.dateRange, [key]: value }
    }));
  };

  const addColumn = (columnValue: string) => {
    if (!reportConfig.columns.includes(columnValue)) {
      setReportConfig(prev => ({
        ...prev,
        columns: [...prev.columns, columnValue]
      }));
    }
  };

  const removeColumn = (columnValue: string) => {
    setReportConfig(prev => ({
      ...prev,
      columns: prev.columns.filter(col => col !== columnValue)
    }));
  };

  const handleReportTypeChange = (type: string) => {
    const newType = type as 'attendance' | 'leave' | 'payroll' | 'department';
    setReportConfig(prev => ({
      ...prev,
      reportType: newType,
      columns: availableColumns[newType].slice(0, 3).map(col => col.value) // Default first 3 columns
    }));
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    if (!reportData) return;

    setExporting(true);
    try {
      // For now, just show a success message as the export functionality would need backend implementation
      const filename = `${reportConfig.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      toast.success(`Report would be exported as ${filename}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  const getColumnLabel = (columnValue: string) => {
    const allColumns = Object.values(availableColumns).flat();
    const column = allColumns.find(col => col.value === columnValue);
    return column ? column.label : columnValue;
  };

  const formatCellValue = (value: unknown, column: string) => {
    if (value === null || value === undefined) return '-';
    
    if (column.includes('Date') && typeof value === 'string') {
      return new Date(value).toLocaleDateString();
    }
    
    if (column.includes('Salary') || column.includes('allowances') || column.includes('deductions') || column.includes('tax')) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(Number(value));
    }
    
    if (column.includes('Rate') || column.includes('Utilization')) {
      return `${Number(value).toFixed(1)}%`;
    }
    
    return String(value);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Custom Report Builder</h2>
          <p className="text-gray-600">Build custom reports with advanced filters</p>
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

      {/* Report Configuration */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center mb-4">
          <Settings className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Report Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Title</label>
              <input
                type="text"
                value={reportConfig.title}
                onChange={(e) => handleConfigChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter report title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select
                value={reportConfig.reportType}
                onChange={(e) => handleReportTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={reportConfig.dateRange.startDate}
                  onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={reportConfig.dateRange.endDate}
                  onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Filters</h4>
            
            {reportConfig.reportType !== 'department' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <select
                  value={reportConfig.filters.employeeId || ''}
                  onChange={(e) => handleFilterChange('employeeId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                                <option value="">All Employees</option>
              {Array.isArray(employees) && employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
                </select>
              </div>
            )}

            {reportConfig.reportType === 'payroll' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <select
                    value={reportConfig.filters.month || ''}
                    onChange={(e) => handleFilterChange('month', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    value={reportConfig.filters.year || ''}
                    onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Column Selection */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Select Columns</h3>
          <span className="text-sm text-gray-500">{reportConfig.columns.length} columns selected</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Available Columns */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Available Columns</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableColumns[reportConfig.reportType].map((column: {value: string; label: string}) => (
                <button
                  key={column.value}
                  onClick={() => addColumn(column.value)}
                  disabled={reportConfig.columns.includes(column.value)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-sm text-gray-900">{column.label}</span>
                  <Plus className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Selected Columns */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Columns</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {reportConfig.columns.map((column) => (
                <div
                  key={column}
                  className="flex items-center justify-between px-3 py-2 bg-blue-50 border border-blue-200 rounded-md"
                >
                  <span className="text-sm text-gray-900">{getColumnLabel(column)}</span>
                  <button
                    onClick={() => removeColumn(column)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {reportConfig.columns.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm">No columns selected</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={generateReport}
            disabled={loading || reportConfig.columns.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Report Results */}
      {reportData && (
        <div className="bg-white rounded-lg border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{reportData.title}</h3>
              <div className="text-sm text-gray-500">
                Generated on {new Date(reportData.generatedAt).toLocaleString()}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {reportData.columns.map((column) => (
                    <th
                      key={column}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {getColumnLabel(column)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.data.map((row, index) => (
                  <tr key={index}>
                    {reportData.columns.map((column) => (
                      <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCellValue(row[column], column)}
                      </td>
                    ))}
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
          <span className="ml-2 text-gray-600">Generating custom report...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !reportData && (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Ready to build your custom report</h3>
          <p className="mt-1 text-sm text-gray-500">Configure your report settings and click Generate Report to get started.</p>
        </div>
      )}
    </div>
  );
};

export default CustomReportBuilder;