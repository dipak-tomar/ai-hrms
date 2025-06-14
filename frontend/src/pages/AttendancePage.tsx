import React, { useState, useEffect } from 'react';
import { Clock, Download, Edit } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import clsx from 'clsx';
import { attendanceService } from '../api/client';
import toast from 'react-hot-toast';

interface AttendanceRecord {
  id: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  totalHours: number | null;
  status: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface AttendanceSummary {
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  totalDays: number;
}

const AttendancePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [filterStatus, setFilterStatus] = useState('all');
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<AttendanceSummary>({
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    halfDays: 0,
    totalDays: 0
  });
  const [isClockedIn, setIsClockedIn] = useState(false);

  // Fetch attendance data
  useEffect(() => {
    fetchAttendanceData();
    checkTodayAttendance();
  }, [selectedDate, filterStatus]);

  const fetchAttendanceData = async () => {
    try {
      setIsLoading(true);
      const params: Record<string, string> = {};
      
      // Parse selected date to get year and month
      const date = new Date(selectedDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      params.year = year.toString();
      params.month = month.toString();
      
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      
      const data = await attendanceService.getAttendance(params);
      setAttendanceData(data);
      
      // Generate monthly report for summary
      try {
        const reportData = await attendanceService.generateReport({
          month,
          year
        });
        setSummary({
          presentDays: reportData.presentDays || 0,
          absentDays: reportData.absentDays || 0,
          lateDays: reportData.lateDays || 0,
          halfDays: reportData.halfDays || 0,
          totalDays: reportData.totalDays || 0
        });
      } catch (error) {
        console.error('Error fetching attendance summary:', error);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setIsLoading(false);
    }
  };

  const checkTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const todayData = await attendanceService.getAttendance({
        dateFrom: today,
        dateTo: today
      });
      
      if (todayData && todayData.length > 0) {
        const todayRecord = todayData[0];
        setIsClockedIn(!!todayRecord.clockIn);
      } else {
        setIsClockedIn(false);
      }
    } catch (error) {
      console.error('Error checking today\'s attendance:', error);
    }
  };

  const handleClockIn = async () => {
    try {
      await attendanceService.clockIn();
      toast.success('Successfully clocked in');
      setIsClockedIn(true);
      fetchAttendanceData();
    } catch (error) {
      console.error('Error clocking in:', error);
      toast.error('Failed to clock in');
    }
  };

  const handleClockOut = async () => {
    try {
      await attendanceService.clockOut({});
      toast.success('Successfully clocked out');
      fetchAttendanceData();
    } catch (error) {
      console.error('Error clocking out:', error);
      toast.error('Failed to clock out');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PRESENT: 'bg-success/10 text-success',
      ABSENT: 'bg-danger/10 text-danger',
      LATE: 'bg-warning/10 text-warning',
      HALF_DAY: 'bg-warning/10 text-warning',
      WORK_FROM_HOME: 'bg-info/10 text-info',
    };
    
    const displayStatus = {
      PRESENT: 'Present',
      ABSENT: 'Absent',
      LATE: 'Late',
      HALF_DAY: 'Half Day',
      WORK_FROM_HOME: 'WFH',
    };
    
    return (
      <span className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
      )}>
        {displayStatus[status as keyof typeof displayStatus] || status}
      </span>
    );
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
          {!isClockedIn ? (
            <Button onClick={handleClockIn} variant="primary" size="sm">
              <Clock className="w-4 h-4 mr-2" />
              Clock In
            </Button>
          ) : (
            <Button onClick={handleClockOut} variant="secondary" size="sm">
              <Clock className="w-4 h-4 mr-2" />
              Clock Out
            </Button>
          )}
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Present', value: summary.presentDays.toString(), color: 'success' },
          { label: 'Absent', value: summary.absentDays.toString(), color: 'danger' },
          { label: 'Late Arrivals', value: summary.lateDays.toString(), color: 'warning' },
          { label: 'Half Days', value: summary.halfDays.toString(), color: 'warning' },
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
                Select Month
              </label>
              <input
                type="month"
                value={selectedDate.substring(0, 7)}
                onChange={(e) => setSelectedDate(`${e.target.value}-01`)}
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
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="LATE">Late</option>
                <option value="HALF_DAY">Half Day</option>
                <option value="WORK_FROM_HOME">Work From Home</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Attendance Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
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
                {attendanceData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  attendanceData.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                        {record.employee ? `${record.employee.firstName} ${record.employee.lastName}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {formatTime(record.clockIn)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {formatTime(record.clockOut)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {record.totalHours ? `${record.totalHours}h` : '--'}
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
                  ))
                )}
              </tbody>
            </table>
          )}
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
              Request corrections for missing check-in/check-out times.
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