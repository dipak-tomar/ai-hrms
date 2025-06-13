import React from 'react';
import { Users, TrendingUp, Calendar, DollarSign, Clock, UserCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Card from '../components/Card';

// Mock data for charts
const performanceData = [
  { month: 'Jan', performance: 85 },
  { month: 'Feb', performance: 88 },
  { month: 'Mar', performance: 92 },
  { month: 'Apr', performance: 89 },
  { month: 'May', performance: 94 },
  { month: 'Jun', performance: 91 },
];

const departmentData = [
  { name: 'Engineering', count: 45, fill: '#0052CC' },
  { name: 'Marketing', count: 20, fill: '#00B8D9' },
  { name: 'Sales', count: 18, fill: '#36B37E' },
  { name: 'HR', count: 8, fill: '#FFAB00' },
  { name: 'Finance', count: 12, fill: '#FF5630' },
];

const attendanceData = [
  { day: 'Mon', present: 85, absent: 8 },
  { day: 'Tue', present: 89, absent: 4 },
  { day: 'Wed', present: 92, absent: 1 },
  { day: 'Thu', present: 88, absent: 5 },
  { day: 'Fri', present: 87, absent: 6 },
];

const DashboardPage: React.FC = () => {
  const stats = [
    {
      name: 'Total Employees',
      value: '103',
      change: '+2.1%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Present Today',
      value: '87',
      change: '+5.4%',
      changeType: 'positive',
      icon: UserCheck,
    },
    {
      name: 'On Leave',
      value: '12',
      change: '-1.2%',
      changeType: 'negative',
      icon: Calendar,
    },
    {
      name: 'Average Performance',
      value: '89.5%',
      change: '+3.2%',
      changeType: 'positive',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary">Welcome back! Here's what's happening at your company.</p>
      </div>

      {/* Stats Grid - Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-secondary truncate">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-xl sm:text-2xl font-semibold text-text-primary">{stat.value}</p>
                    <span className={`ml-2 text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-success' : 'text-danger'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid - Stack on mobile, side by side on larger screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <Card>
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
              Performance Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke="#6B778C" fontSize={12} />
                  <YAxis stroke="#6B778C" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="performance" 
                    stroke="#0052CC" 
                    strokeWidth={3}
                    dot={{ fill: '#0052CC', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Department Distribution */}
        <Card>
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
              Department Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {departmentData.map((dept) => (
                <div key={dept.name} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                    style={{ backgroundColor: dept.fill }}
                  />
                  <span className="text-text-secondary truncate">{dept.name}: {dept.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Attendance - Full width */}
      <Card>
        <div className="p-4 sm:p-6">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
            Weekly Attendance
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" stroke="#6B778C" fontSize={12} />
                <YAxis stroke="#6B778C" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <Bar dataKey="present" fill="#36B37E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#FF5630" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Recent Activity & Upcoming Events - Stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
              Recent Activities
            </h3>
            <div className="space-y-4">
              {[
                { action: 'New employee onboarded', user: 'Sarah Johnson', time: '2 hours ago' },
                { action: 'Leave request approved', user: 'Michael Chen', time: '4 hours ago' },
                { action: 'Performance review completed', user: 'Emily Rodriguez', time: '6 hours ago' },
                { action: 'Payroll processed', user: 'System', time: '1 day ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary">{activity.action}</p>
                    <p className="text-xs text-text-secondary">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
              Upcoming Events
            </h3>
            <div className="space-y-4">
              {[
                { event: 'Team Building Event', date: 'Tomorrow', type: 'Company' },
                { event: 'Monthly All-Hands', date: 'Dec 15', type: 'Meeting' },
                { event: 'Holiday Party', date: 'Dec 20', type: 'Social' },
                { event: 'Performance Reviews Due', date: 'Dec 31', type: 'Deadline' },
              ].map((event, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{event.event}</p>
                    <p className="text-xs text-text-secondary">{event.type}</p>
                  </div>
                  <span className="text-xs text-primary font-medium ml-2 flex-shrink-0">{event.date}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;