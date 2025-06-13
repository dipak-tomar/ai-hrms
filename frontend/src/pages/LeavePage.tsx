import React, { useState } from 'react';
import { Plus, Calendar, Check, X, Clock } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import clsx from 'clsx';

// Mock data
const leaveRequests = [
  {
    id: '1',
    employee: 'Sarah Johnson',
    type: 'Annual Leave',
    startDate: '2024-01-20',
    endDate: '2024-01-22',
    days: 3,
    reason: 'Family vacation',
    status: 'pending',
    appliedOn: '2024-01-15',
  },
  {
    id: '2',
    employee: 'Michael Chen',
    type: 'Sick Leave',
    startDate: '2024-01-18',
    endDate: '2024-01-18',
    days: 1,
    reason: 'Medical appointment',
    status: 'approved',
    appliedOn: '2024-01-17',
  },
  {
    id: '3',
    employee: 'Emily Rodriguez',
    type: 'Personal Leave',
    startDate: '2024-01-25',
    endDate: '2024-01-26',
    days: 2,
    reason: 'Personal matters',
    status: 'rejected',
    appliedOn: '2024-01-16',
  },
];

const LeavePage: React.FC = () => {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-warning/10 text-warning',
      approved: 'bg-success/10 text-success',
      rejected: 'bg-danger/10 text-danger',
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Leave Management</h1>
          <p className="text-text-secondary">Manage leave requests and track balances</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="flex bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'px-3 py-1 text-sm font-medium rounded transition-colors flex-1 sm:flex-none',
                viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-text-secondary'
              )}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={clsx(
                'px-3 py-1 text-sm font-medium rounded transition-colors flex-1 sm:flex-none',
                viewMode === 'calendar' ? 'bg-white text-primary shadow-sm' : 'text-text-secondary'
              )}
            >
              Calendar View
            </button>
          </div>
          <Button size="sm" onClick={() => setShowApplyForm(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Apply for Leave
          </Button>
        </div>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { type: 'Annual Leave', used: 8, total: 20, color: 'primary' },
          { type: 'Sick Leave', used: 3, total: 10, color: 'danger' },
          { type: 'Personal Leave', used: 2, total: 5, color: 'warning' },
          { type: 'Maternity Leave', used: 0, total: 90, color: 'success' },
        ].map((leave) => (
          <Card key={leave.type}>
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-text-secondary">{leave.type}</h3>
                <Calendar className="w-5 h-5 text-text-secondary" />
              </div>
              <div className="flex items-baseline">
                <p className="text-xl sm:text-2xl font-semibold text-text-primary">
                  {leave.total - leave.used}
                </p>
                <span className="ml-1 text-sm text-text-secondary">
                  / {leave.total} days
                </span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${leave.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${(leave.used / leave.total) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  {leave.used} days used
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Leave Requests */}
      {viewMode === 'list' ? (
        <Card padding="none">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg font-heading font-semibold text-text-primary">
              Recent Leave Requests
            </h3>
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Reason
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
                {leaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                      {request.employee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {request.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                      <br />
                      <span className="text-xs">({request.days} days)</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary max-w-xs truncate">
                      {request.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {request.status === 'pending' && (
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-success hover:text-green-700 transition-colors">
                            <Check className="w-4 h-4" />
                          </button>
                          <button className="text-danger hover:text-red-700 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {leaveRequests.map((request) => (
              <div key={request.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">{request.employee}</p>
                    <p className="text-sm text-text-secondary">{request.type}</p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                <div className="space-y-1 text-sm text-text-secondary">
                  <p>
                    {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()} ({request.days} days)
                  </p>
                  <p className="truncate">{request.reason}</p>
                </div>
                {request.status === 'pending' && (
                  <div className="flex items-center justify-end space-x-2 mt-3">
                    <button className="text-success hover:text-green-700 transition-colors p-1">
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="text-danger hover:text-red-700 transition-colors p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
              Leave Calendar
            </h3>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-text-secondary">Calendar view will be implemented here</p>
              <p className="text-sm text-text-secondary mt-2">
                This would show approved/pending leaves in a calendar format
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Apply for Leave Modal */}
      {showApplyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
              Apply for Leave
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Leave Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                  <option>Annual Leave</option>
                  <option>Sick Leave</option>
                  <option>Personal Leave</option>
                  <option>Maternity Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Reason
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Enter reason for leave"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowApplyForm(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavePage;