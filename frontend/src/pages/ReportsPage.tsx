import React, { useState } from 'react';
import { BarChart3, Download, Calendar, Filter, Plus } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import clsx from 'clsx';

// Mock data for report templates
const reportTemplates = [
  {
    id: '1',
    name: 'Payroll Summary',
    description: 'Monthly payroll breakdown by department',
    category: 'Payroll',
    lastRun: '2024-01-15',
    frequency: 'Monthly',
  },
  {
    id: '2',
    name: 'Attendance Trends',
    description: 'Employee attendance patterns and trends',
    category: 'Attendance',
    lastRun: '2024-01-14',
    frequency: 'Weekly',
  },
  {
    id: '3',
    name: 'Leave Utilization',
    description: 'Leave balance and utilization report',
    category: 'Leave',
    lastRun: '2024-01-10',
    frequency: 'Quarterly',
  },
  {
    id: '4',
    name: 'Performance Overview',
    description: 'Team performance metrics and ratings',
    category: 'Performance',
    lastRun: '2024-01-12',
    frequency: 'Monthly',
  },
];

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [showBuilder, setShowBuilder] = useState(false);

  const tabs = [
    { id: 'templates', name: 'Report Templates' },
    { id: 'custom', name: 'Custom Reports' },
    { id: 'scheduled', name: 'Scheduled Reports' },
    { id: 'analytics', name: 'Analytics' },
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      Payroll: 'bg-primary/10 text-primary',
      Attendance: 'bg-success/10 text-success',
      Leave: 'bg-warning/10 text-warning',
      Performance: 'bg-accent/10 text-accent',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Reports</h1>
          <p className="text-text-secondary">Generate insights and analytics for your HR data</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button size="sm" onClick={() => setShowBuilder(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Reports', value: '24', icon: BarChart3 },
          { label: 'Scheduled', value: '8', icon: Calendar },
          { label: 'Generated Today', value: '5', icon: Download },
          { label: 'Custom Reports', value: '12', icon: Filter },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
                    <p className="text-2xl font-semibold text-text-primary">{stat.value}</p>
                  </div>
                  <Icon className="w-8 h-8 text-primary/20" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                )}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="pt-6">
          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reportTemplates.map((template) => (
                <Card key={template.id}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-heading font-semibold text-text-primary mb-1">
                          {template.name}
                        </h3>
                        <p className="text-sm text-text-secondary mb-2">
                          {template.description}
                        </p>
                      </div>
                      <span className={clsx(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getCategoryColor(template.category)
                      )}>
                        {template.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
                      <span>Last run: {new Date(template.lastRun).toLocaleDateString()}</span>
                      <span>Frequency: {template.frequency}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Generate
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'custom' && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-heading font-semibold text-text-primary">
                    Custom Report Builder
                  </h3>
                  <Button size="sm" onClick={() => setShowBuilder(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Report
                  </Button>
                </div>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-text-secondary">Custom report builder will be implemented here</p>
                  <p className="text-sm text-text-secondary mt-2">
                    Drag and drop fields to create custom reports
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'scheduled' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-6">
                  Scheduled Reports
                </h3>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-text-secondary">Scheduled reports management will be implemented here</p>
                  <p className="text-sm text-text-secondary mt-2">
                    Set up automatic report generation and email delivery
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'analytics' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-6">
                  HR Analytics Dashboard
                </h3>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-text-secondary">Advanced analytics dashboard will be implemented here</p>
                  <p className="text-sm text-text-secondary mt-2">
                    Interactive charts and insights for HR metrics
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Custom Report Builder Modal */}
      {showBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
              Create Custom Report
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Report Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Enter report name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Describe what this report will show"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Data Source
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                    <option>Employees</option>
                    <option>Attendance</option>
                    <option>Leave</option>
                    <option>Payroll</option>
                    <option>Performance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Report Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                    <option>Table</option>
                    <option>Chart</option>
                    <option>Summary</option>
                    <option>Dashboard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Fields to Include
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Name', 'Department', 'Designation', 'Salary', 'Join Date', 'Status'].map((field) => (
                    <label key={field} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-text-primary">{field}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowBuilder(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Create Report
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;