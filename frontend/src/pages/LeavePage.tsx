import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Check, X, Loader } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import clsx from 'clsx';
import { leaveService } from '../api/client';
import { LeaveApplication, LeaveBalance, LeaveType } from '../api/client';
import toast from 'react-hot-toast';

interface LeaveFormData {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
}

const LeavePage: React.FC = () => {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveApplication[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [formData, setFormData] = useState<LeaveFormData>({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const fetchLeaveData = async () => {
    setIsLoading(true);
    try {
      // Fetch leave applications
      const applications = await leaveService.getLeaveApplications();
      setLeaveRequests(applications);

      // Fetch leave balances
      const balances = await leaveService.getLeaveBalance();
      setLeaveBalances(balances);

      // Fetch leave types for the form
      const types = await leaveService.getLeaveTypes({ isActive: true });
      setLeaveTypes(types);
    } catch (error) {
      console.error('Error fetching leave data:', error);
      toast.error('Failed to load leave data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyForLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.leaveTypeId || !formData.startDate || !formData.endDate || !formData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await leaveService.applyForLeave(formData);
      toast.success('Leave application submitted successfully');
      setShowApplyForm(false);
      // Reset form data
      setFormData({
        leaveTypeId: '',
        startDate: '',
        endDate: '',
        reason: ''
      });
      // Refresh leave data
      fetchLeaveData();
    } catch (error) {
      console.error('Error applying for leave:', error);
      toast.error('Failed to submit leave application');
    }
  };

  const handleCancelLeave = async (id: string) => {
    try {
      await leaveService.cancelLeaveApplication(id);
      toast.success('Leave application cancelled successfully');
      fetchLeaveData();
    } catch (error) {
      console.error('Error cancelling leave:', error);
      toast.error('Failed to cancel leave application');
    }
  };

  const handleUpdateLeaveStatus = async (id: string, status: 'APPROVED' | 'REJECTED', rejectedReason?: string) => {
    try {
      await leaveService.updateLeaveApplication(id, { status, rejectedReason });
      toast.success(`Leave application ${status.toLowerCase()} successfully`);
      fetchLeaveData();
    } catch (error) {
      console.error('Error updating leave status:', error);
      toast.error('Failed to update leave status');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-warning/10 text-warning',
      APPROVED: 'bg-success/10 text-success',
      REJECTED: 'bg-danger/10 text-danger',
      CANCELLED: 'bg-gray-200 text-gray-600',
    };
    
    return (
      <span className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        styles[status as keyof typeof styles] || styles.PENDING
      )}>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
        {isLoading ? (
          Array(4).fill(0).map((_, index) => (
            <Card key={index}>
              <div className="p-4 sm:p-6 flex items-center justify-center">
                <Loader className="w-6 h-6 text-primary animate-spin" />
              </div>
            </Card>
          ))
        ) : (
          leaveBalances.map((balance) => (
            <Card key={balance.leaveTypeId}>
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-text-secondary">{balance.leaveTypeName}</h3>
                  <Calendar className="w-5 h-5 text-text-secondary" />
                </div>
                <div className="flex items-baseline">
                  <p className="text-xl sm:text-2xl font-semibold text-text-primary">
                    {balance.remaining}
                  </p>
                  <span className="ml-1 text-sm text-text-secondary">
                    / {balance.maxDays} days
                  </span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(balance.used / balance.maxDays) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    {balance.used} days used, {balance.pending} pending
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Leave Application Form */}
      {showApplyForm && (
        <Card>
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-heading font-semibold text-text-primary">
                Apply for Leave
              </h3>
              <button 
                onClick={() => setShowApplyForm(false)}
                className="text-text-secondary hover:text-danger"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleApplyForLeave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Leave Type
                </label>
                <select
                  name="leaveTypeId"
                  value={formData.leaveTypeId}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Reason
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setShowApplyForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm">Submit Request</Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {/* Leave Requests */}
      {viewMode === 'list' ? (
        <Card padding="none">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg font-heading font-semibold text-text-primary">
              Recent Leave Requests
            </h3>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <>
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
                    {leaveRequests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          No leave requests found
                        </td>
                      </tr>
                    ) : (
                      leaveRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                            {request.employee ? `${request.employee.firstName} ${request.employee.lastName}` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                            {request.leaveType?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                            {formatDate(request.startDate)} - {formatDate(request.endDate)}
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
                            {request.status === 'PENDING' && (
                              <div className="flex items-center justify-end space-x-2">
                                <button 
                                  className="text-success hover:text-green-700 transition-colors"
                                  onClick={() => handleUpdateLeaveStatus(request.id, 'APPROVED')}
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button 
                                  className="text-danger hover:text-red-700 transition-colors"
                                  onClick={() => handleUpdateLeaveStatus(request.id, 'REJECTED')}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                            {request.status === 'APPROVED' && (
                              <button 
                                className="text-danger hover:text-red-700 transition-colors"
                                onClick={() => handleCancelLeave(request.id)}
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-gray-200">
                {leaveRequests.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No leave requests found
                  </div>
                ) : (
                  leaveRequests.map((request) => (
                    <div key={request.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary">
                            {request.employee ? `${request.employee.firstName} ${request.employee.lastName}` : 'N/A'}
                          </p>
                          <p className="text-sm text-text-secondary">{request.leaveType?.name || 'N/A'}</p>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="space-y-1 text-sm text-text-secondary">
                        <p>
                          {formatDate(request.startDate)} - {formatDate(request.endDate)} ({request.days} days)
                        </p>
                        <p className="truncate">{request.reason}</p>
                      </div>
                      {request.status === 'PENDING' && (
                        <div className="flex items-center justify-end space-x-2 mt-3">
                          <button 
                            className="text-success hover:text-green-700 transition-colors p-1"
                            onClick={() => handleUpdateLeaveStatus(request.id, 'APPROVED')}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-danger hover:text-red-700 transition-colors p-1"
                            onClick={() => handleUpdateLeaveStatus(request.id, 'REJECTED')}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {request.status === 'APPROVED' && (
                        <div className="flex justify-end mt-3">
                          <button 
                            className="text-danger hover:text-red-700 transition-colors text-sm"
                            onClick={() => handleCancelLeave(request.id)}
                          >
                            Cancel Leave
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </Card>
      ) : (
        <Card>
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
              Leave Calendar
            </h3>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-text-secondary">Calendar view will be implemented soon</p>
              <p className="text-sm text-text-secondary mt-2">
                View team availability and plan your leaves accordingly
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default LeavePage;