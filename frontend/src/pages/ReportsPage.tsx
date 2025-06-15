import React, { useState } from 'react';
import { FileText, BarChart3, Users, DollarSign, Download, Calendar, Filter } from 'lucide-react';
import AttendanceReport from '../components/reports/AttendanceReport';
import LeaveReport from '../components/reports/LeaveReport';
import PerformanceReport from '../components/reports/PerformanceReport';
import PayrollReport from '../components/reports/PayrollReport';
import DepartmentAnalytics from '../components/reports/DepartmentAnalytics';
import CustomReportBuilder from '../components/reports/CustomReportBuilder';

type ReportTab = 'attendance' | 'leave' | 'performance' | 'payroll' | 'department' | 'custom';

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('attendance');

  const tabs = [
    {
      id: 'attendance' as ReportTab,
      name: 'Attendance Reports',
      icon: Calendar,
      description: 'Employee attendance and time tracking reports'
    },
    {
      id: 'leave' as ReportTab,
      name: 'Leave Reports',
      icon: FileText,
      description: 'Leave applications and utilization reports'
    },
    {
      id: 'performance' as ReportTab,
      name: 'Performance Reports',
      icon: BarChart3,
      description: 'Employee performance and review reports'
    },
    {
      id: 'payroll' as ReportTab,
      name: 'Payroll Reports',
      icon: DollarSign,
      description: 'Salary and payroll processing reports'
    },
    {
      id: 'department' as ReportTab,
      name: 'Department Analytics',
      icon: Users,
      description: 'Department-wise analytics and insights'
    },
    {
      id: 'custom' as ReportTab,
      name: 'Custom Reports',
      icon: Filter,
      description: 'Build custom reports with advanced filters'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'attendance':
        return <AttendanceReport />;
      case 'leave':
        return <LeaveReport />;
      case 'performance':
        return <PerformanceReport />;
      case 'payroll':
        return <PayrollReport />;
      case 'department':
        return <DepartmentAnalytics />;
      case 'custom':
        return <CustomReportBuilder />;
      default:
        return <AttendanceReport />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate comprehensive reports and analyze organizational data</p>
        </div>
        <div className="flex items-center space-x-3">
          <Download className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Export available in Excel & PDF formats</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon
                  className={`mr-2 h-5 w-5 ${
                    activeTab === tab.id ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                <div className="text-left">
                  <div>{tab.name}</div>
                  <div className="text-xs text-gray-400 font-normal">{tab.description}</div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ReportsPage;