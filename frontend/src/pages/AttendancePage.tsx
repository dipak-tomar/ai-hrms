import React, { useState } from 'react';
import { Calendar, Clock, Download, Edit } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import clsx from 'clsx';

// Mock data
const attendanceData = [
  {
    id: '1',
    date: '2024-01-15',
    employee: 'Sarah Johnson',
    checkIn: '09:00 AM',
    checkOut: '06:30 PM',
    totalHours: '9h 30m',
    status: 'present',
  },
  {
    id: '2',
    date: '2024-01-15',
    employee: 'Michael Chen',
    checkIn: '08:45 AM',
    checkOut: '05:45 PM',
    totalHours: '9h 00m',
    status: 'present',
  },
  {
    id: '3',
    date: '2024-01-15',
    employee: 'Emily Rodriguez',
    checkIn: '09:15 AM',
    checkOut: '--',
    totalHours: '--',
    status: 'incomplete',
  },
  {
    id: '4',
    date: '2024-01-15',
    employee: 'David Wilson',
    checkIn: '--',
    checkOut: '--',
    totalHours: '--',
    status: 'absent',
  },
];

const AttendancePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusBadge = (status: string) => {
    const styles = {
      present: 'bg-success/10 text-success',
      absent: 'bg-danger/10 text-danger',
      incomplete: 'bg-warning/10 text-warning',
      late: 'bg-warning/10 text-warning',
    };
    
    return (
      <span className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        styles[status as keyof typeof styles] || styles.present
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
          <h1 className="text-2xl font-heading font-bold text-text-primary">Attendance</h1>
          <p className="text-text-secondary">Track employee attendance and working hours</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Present Today', value: '87', color: 'success' },
          { label: 'Absent Today', value: '12', color: 'danger' },
          { label: 'Late Arrivals', value: '5', color: 'warning' },
          { label: 'Early Departures', value: '3', color: 'warning' },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
                  <p className="text-2xl font-semibold text-text-primary">{stat.value}</p>
                </div>
                <div className={`w-3 h-3 rounded-full bg-${stat.color}`}></div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="incomplete">Incomplete</option>
                <option value="late">Late</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Attendance Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Total Hours
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
              {attendanceData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                    {record.employee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                    {record.checkIn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                    {record.checkOut}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                    {record.totalHours}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary hover:text-blue-700 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
              Edit Missing Punches
            </h3>
            <p className="text-text-secondary mb-4">
              Employees can request corrections for missing check-in/check-out times.
            </p>
            <Button size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Submit Correction Request
            </Button>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
              Attendance Reports
            </h3>
            <p className="text-text-secondary mb-4">
              Generate detailed attendance reports for payroll and compliance.
            </p>
            <div className="flex space-x-2">
              <Button size="sm" variant="secondary">
                <Download className="w-4 h-4 mr-2" />
                PDF Report
              </Button>
              <Button size="sm" variant="secondary">
                <Download className="w-4 h-4 mr-2" />
                CSV Export
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AttendancePage;