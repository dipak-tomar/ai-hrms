import React, { useState } from 'react';
import { DollarSign, Download, Play, Settings, FileText } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import clsx from 'clsx';

// Mock data
const payrollData = [
  {
    id: '1',
    employee: 'Sarah Johnson',
    basicSalary: 95000,
    allowances: 15000,
    deductions: 8500,
    netSalary: 101500,
    status: 'processed',
    month: 'December 2024',
  },
  {
    id: '2',
    employee: 'Michael Chen',
    basicSalary: 105000,
    allowances: 18000,
    deductions: 9200,
    netSalary: 113800,
    status: 'processed',
    month: 'December 2024',
  },
  {
    id: '3',
    employee: 'Emily Rodriguez',
    basicSalary: 75000,
    allowances: 12000,
    deductions: 6800,
    netSalary: 80200,
    status: 'pending',
    month: 'December 2024',
  },
];

const PayrollPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showRunPayroll, setShowRunPayroll] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'salary-structure', name: 'Salary Structure' },
    { id: 'payslips', name: 'Payslips' },
    { id: 'reports', name: 'Reports' },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      processed: 'bg-success/10 text-success',
      pending: 'bg-warning/10 text-warning',
      failed: 'bg-danger/10 text-danger',
    };
    
    return (
      <span className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        styles[status as keyof typeof styles] || styles.pending
      )}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Payroll</h1>
          <p className="text-text-secondary">Manage salary structures and process payroll</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => setShowRunPayroll(true)}>
            <Play className="w-4 h-4 mr-2" />
            Run Payroll
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Payroll', value: '$295,500', change: '+2.5%', color: 'primary' },
          { label: 'Processed', value: '87', change: '+5.2%', color: 'success' },
          { label: 'Pending', value: '16', change: '-1.2%', color: 'warning' },
          { label: 'Average Salary', value: '$89,250', change: '+3.1%', color: 'accent' },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-text-primary">{stat.value}</p>
                    <span className="ml-2 text-sm font-medium text-success">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-primary/20" />
              </div>
            </div>
          </Card>
        ))}
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
          {activeTab === 'overview' && (
            <Card padding="none">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-heading font-semibold text-text-primary">
                  Current Month Payroll
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Basic Salary
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Allowances
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Deductions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Net Salary
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payrollData.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                          {record.employee}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                          ${record.basicSalary.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-success">
                          +${record.allowances.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-danger">
                          -${record.deductions.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                          ${record.netSalary.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(record.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary hover:text-blue-700 transition-colors">
                            <FileText className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === 'salary-structure' && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-heading font-semibold text-text-primary">
                    Salary Structure Builder
                  </h3>
                  <Button size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </div>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-text-secondary">Salary structure configuration will be implemented here</p>
                  <p className="text-sm text-text-secondary mt-2">
                    Define salary components, allowances, and deductions
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'payslips' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-6">
                  Payslip Viewer
                </h3>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-text-secondary">Payslip management will be implemented here</p>
                  <p className="text-sm text-text-secondary mt-2">
                    View, download, and manage employee payslips
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'reports' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-6">
                  Payroll Reports
                </h3>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Download className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-text-secondary">Payroll reporting will be implemented here</p>
                  <p className="text-sm text-text-secondary mt-2">
                    Generate comprehensive payroll reports and analytics
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Run Payroll Modal */}
      {showRunPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
              Run Payroll
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Payroll Month
                </label>
                <input
                  type="month"
                  defaultValue="2024-01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Preview:</strong> This will process payroll for 103 employees.
                  Total amount: $295,500
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowRunPayroll(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Confirm & Process
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollPage;