import React, { useState } from 'react';
import { Target, TrendingUp, Plus, Star, Award } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import clsx from 'clsx';

// Mock data
const goals = [
  {
    id: '1',
    title: 'Complete React Migration',
    description: 'Migrate legacy components to React',
    progress: 75,
    dueDate: '2024-02-15',
    status: 'on-track',
    employee: 'Sarah Johnson',
  },
  {
    id: '2',
    title: 'Improve Code Coverage',
    description: 'Increase test coverage to 90%',
    progress: 60,
    dueDate: '2024-01-30',
    status: 'at-risk',
    employee: 'Michael Chen',
  },
  {
    id: '3',
    title: 'Launch Marketing Campaign',
    description: 'Q1 product marketing campaign',
    progress: 90,
    dueDate: '2024-01-25',
    status: 'on-track',
    employee: 'Emily Rodriguez',
  },
];

const reviews = [
  {
    id: '1',
    employee: 'Sarah Johnson',
    reviewer: 'John Smith',
    period: 'Q4 2023',
    rating: 4.5,
    status: 'completed',
    dueDate: '2024-01-15',
  },
  {
    id: '2',
    employee: 'Michael Chen',
    reviewer: 'Lisa Wong',
    period: 'Q4 2023',
    rating: null,
    status: 'pending',
    dueDate: '2024-01-20',
  },
  {
    id: '3',
    employee: 'Emily Rodriguez',
    reviewer: 'David Wilson',
    period: 'Q4 2023',
    rating: 4.2,
    status: 'completed',
    dueDate: '2024-01-10',
  },
];

const PerformancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('goals');

  const tabs = [
    { id: 'goals', name: 'Goals & OKRs' },
    { id: 'reviews', name: 'Performance Reviews' },
    { id: 'feedback', name: '360° Feedback' },
    { id: 'analytics', name: 'Analytics' },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      'on-track': 'bg-success/10 text-success',
      'at-risk': 'bg-warning/10 text-warning',
      'overdue': 'bg-danger/10 text-danger',
      'completed': 'bg-success/10 text-success',
      'pending': 'bg-warning/10 text-warning',
    };
    
    return (
      <span className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        styles[status as keyof typeof styles] || styles['on-track']
      )}>
        {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={clsx(
          'w-4 h-4',
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        )}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Performance</h1>
          <p className="text-text-secondary">Track goals, reviews, and team performance</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">
            <Award className="w-4 h-4 mr-2" />
            Recognition
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Goals', value: '24', change: '+3', color: 'primary' },
          { label: 'Completed Goals', value: '18', change: '+5', color: 'success' },
          { label: 'Pending Reviews', value: '8', change: '-2', color: 'warning' },
          { label: 'Avg Rating', value: '4.3', change: '+0.2', color: 'accent' },
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
                <Target className="w-8 h-8 text-primary/20" />
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
          {activeTab === 'goals' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {goals.map((goal) => (
                  <Card key={goal.id}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-heading font-semibold text-text-primary mb-1">
                            {goal.title}
                          </h3>
                          <p className="text-sm text-text-secondary mb-2">
                            {goal.description}
                          </p>
                          <p className="text-xs text-text-secondary">
                            Assigned to: {goal.employee}
                          </p>
                        </div>
                        {getStatusBadge(goal.status)}
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-text-primary">Progress</span>
                          <span className="text-sm text-text-secondary">{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">
                          Due: {new Date(goal.dueDate).toLocaleDateString()}
                        </span>
                        <button className="text-primary hover:text-blue-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <Card padding="none">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-heading font-semibold text-text-primary">
                  Performance Reviews
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
                        Reviewer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reviews.map((review) => (
                      <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                          {review.employee}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                          {review.reviewer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {review.period}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {review.rating ? (
                            <div className="flex items-center space-x-1">
                              {renderStars(review.rating)}
                              <span className="ml-2 text-sm text-text-secondary">
                                {review.rating}
                              </span>
                            </div>
                          ) : (
                            <span className="text-text-secondary">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(review.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {new Date(review.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary hover:text-blue-700 transition-colors">
                            {review.status === 'pending' ? 'Complete' : 'View'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === 'feedback' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-6">
                  360° Feedback
                </h3>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-text-secondary">360° feedback system will be implemented here</p>
                  <p className="text-sm text-text-secondary mt-2">
                    Collect feedback from peers, managers, and direct reports
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'analytics' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-6">
                  Performance Analytics
                </h3>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-text-secondary">Performance analytics will be implemented here</p>
                  <p className="text-sm text-text-secondary mt-2">
                    Visualize performance trends and insights
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;