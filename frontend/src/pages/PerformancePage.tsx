import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Plus, Star, Award, Loader } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import clsx from 'clsx';
import { performanceService, Goal, PerformanceReview, PerformanceMetrics } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

interface GoalFormData {
  title: string;
  description: string;
  targetDate: string;
}

const PerformancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('goals');
  const [isLoading, setIsLoading] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalFormData, setGoalFormData] = useState<GoalFormData>({
    title: '',
    description: '',
    targetDate: new Date().toISOString().split('T')[0]
  });
  
  const user = useAuthStore(state => state.user);
  const isHR = user?.role?.includes('HR') || user?.role?.includes('SUPER_ADMIN');
  const isManager = user?.role?.includes('MANAGER') || isHR;

  const tabs = [
    { id: 'goals', name: 'Goals & OKRs' },
    { id: 'reviews', name: 'Performance Reviews' },
    { id: 'feedback', name: '360° Feedback' },
    { id: 'analytics', name: 'Analytics' },
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'goals' || activeTab === 'analytics') {
        const goalsData = await performanceService.getMyGoals();
        setGoals(goalsData);
      }
      
      if (activeTab === 'reviews' || activeTab === 'analytics') {
        const reviewsData = await performanceService.getMyPerformanceReviews();
        setReviews(reviewsData);
        
        if (isManager) {
          const reviewsToComplete = await performanceService.getReviewsToComplete();
          // Combine with existing reviews but avoid duplicates
          const existingIds = reviewsData.map(r => r.id);
          const newReviews = [...reviewsData];
          
          reviewsToComplete.forEach(review => {
            if (!existingIds.includes(review.id)) {
              newReviews.push(review);
            }
          });
          
          setReviews(newReviews);
        }
      }
      
      if (activeTab === 'analytics') {
        const metricsData = await performanceService.getMyPerformanceMetrics();
        setMetrics(metricsData);
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
      toast.error('Failed to load performance data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await performanceService.createGoal({
        employeeId: user?.id || '',
        title: goalFormData.title,
        description: goalFormData.description,
        targetDate: goalFormData.targetDate,
        status: 'NOT_STARTED'
      });
      
      toast.success('Goal created successfully');
      setShowGoalForm(false);
      setGoalFormData({
        title: '',
        description: '',
        targetDate: new Date().toISOString().split('T')[0]
      });
      
      // Refresh goals
      const goalsData = await performanceService.getMyGoals();
      setGoals(goalsData);
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateGoalStatus = async (id: string, status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED') => {
    try {
      await performanceService.updateGoal(id, { status });
      toast.success('Goal status updated');
      
      // Refresh goals
      const goalsData = await performanceService.getMyGoals();
      setGoals(goalsData);
    } catch (error) {
      console.error('Error updating goal status:', error);
      toast.error('Failed to update goal status');
    }
  };

  const handleGoalFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGoalFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'NOT_STARTED': 'bg-gray-100 text-gray-800',
      'IN_PROGRESS': 'bg-warning/10 text-warning',
      'COMPLETED': 'bg-success/10 text-success',
      'CANCELLED': 'bg-danger/10 text-danger',
      'DRAFT': 'bg-gray-100 text-gray-800',
      'PENDING': 'bg-warning/10 text-warning',
      'APPROVED': 'bg-success/10 text-success',
      'REJECTED': 'bg-danger/10 text-danger',
    };
    
    return (
      <span className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        styles[status as keyof typeof styles] || styles['IN_PROGRESS']
      )}>
        {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  const calculateProgress = (goal: Goal) => {
    switch (goal.status) {
      case 'NOT_STARTED':
        return 0;
      case 'IN_PROGRESS':
        return 50;
      case 'COMPLETED':
        return 100;
      case 'CANCELLED':
        return 0;
      default:
        return 0;
    }
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
          <Button size="sm" onClick={() => setShowGoalForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, index) => (
            <Card key={index}>
              <div className="p-6 flex items-center justify-center">
                <Loader className="w-6 h-6 text-primary animate-spin" />
              </div>
            </Card>
          ))
        ) : (
          [
            { 
              label: 'Active Goals', 
              value: goals.filter(g => g.status === 'IN_PROGRESS').length.toString(), 
              change: '+3', 
              color: 'primary' 
            },
            { 
              label: 'Completed Goals', 
              value: goals.filter(g => g.status === 'COMPLETED').length.toString(), 
              change: '+5', 
              color: 'success' 
            },
            { 
              label: 'Pending Reviews', 
              value: reviews.filter(r => r.status === 'PENDING').length.toString(), 
              change: '-2', 
              color: 'warning' 
            },
            { 
              label: 'Avg Rating', 
              value: metrics?.averageRating.toFixed(1) || 'N/A', 
              change: '+0.2', 
              color: 'accent' 
            },
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
          ))
        )}
      </div>

      {/* New Goal Form */}
      {showGoalForm && (
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-heading font-semibold text-text-primary">
                Create New Goal
              </h3>
              <button 
                onClick={() => setShowGoalForm(false)}
                className="text-text-secondary hover:text-danger"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={goalFormData.title}
                  onChange={handleGoalFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={goalFormData.description}
                  onChange={handleGoalFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  name="targetDate"
                  value={goalFormData.targetDate}
                  onChange={handleGoalFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setShowGoalForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Goal
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}

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
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : goals.length === 0 ? (
                <Card>
                  <div className="p-8 text-center">
                    <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-text-secondary">No goals found</p>
                    <p className="text-sm text-text-secondary mt-2">
                      Create your first goal to get started
                    </p>
                    <Button 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setShowGoalForm(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Goal
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {goals.map((goal) => {
                    const progress = calculateProgress(goal);
                    const targetDate = new Date(goal.targetDate).toLocaleDateString();
                    
                    return (
                      <Card key={goal.id}>
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-heading font-semibold text-text-primary mb-1">
                                {goal.title}
                              </h3>
                              <p className="text-sm text-text-secondary mb-2">
                                {goal.description || 'No description provided'}
                              </p>
                              {goal.employee && (
                                <p className="text-xs text-text-secondary">
                                  Assigned to: {goal.employee.firstName} {goal.employee.lastName}
                                </p>
                              )}
                            </div>
                            {getStatusBadge(goal.status)}
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-text-primary">Progress</span>
                              <span className="text-sm text-text-secondary">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-text-secondary">
                              Due: {targetDate}
                            </span>
                            <div className="flex space-x-2">
                              {goal.status !== 'COMPLETED' && (
                                <button 
                                  className="text-success hover:text-green-700 transition-colors"
                                  onClick={() => handleUpdateGoalStatus(goal.id, 'COMPLETED')}
                                  title="Mark as Completed"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                              )}
                              
                              {goal.status === 'NOT_STARTED' && (
                                <button 
                                  className="text-primary hover:text-blue-700 transition-colors"
                                  onClick={() => handleUpdateGoalStatus(goal.id, 'IN_PROGRESS')}
                                  title="Start Working"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <Card padding="none">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-heading font-semibold text-text-primary">
                  Performance Reviews
                </h3>
              </div>
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : (
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
                        <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reviews.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                            No reviews found
                          </td>
                        </tr>
                      ) : (
                        reviews.map((review) => (
                          <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                              {review.reviewee ? `${review.reviewee.firstName} ${review.reviewee.lastName}` : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                              {review.reviewer ? `${review.reviewer.firstName} ${review.reviewer.lastName}` : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                              {review.period}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {review.overallRating ? (
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-text-primary mr-2">
                                    {review.overallRating.toFixed(1)}
                                  </span>
                                  <div className="flex">
                                    {renderStars(review.overallRating)}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-sm text-text-secondary">Not rated</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(review.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-primary hover:text-blue-700 transition-colors">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
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
                  <p className="text-text-secondary">360° feedback will be implemented here</p>
                  <p className="text-sm text-text-secondary mt-2">
                    Request and provide feedback from peers, managers, and direct reports
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : !metrics ? (
                <Card>
                  <div className="p-8 text-center">
                    <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-text-secondary">No performance data available</p>
                  </div>
                </Card>
              ) : (
                <>
                  <Card>
                    <div className="p-6">
                      <h3 className="text-lg font-heading font-semibold text-text-primary mb-6">
                        Performance Overview
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-text-secondary">Average Rating</p>
                          <div className="flex items-center mt-1">
                            <span className="text-2xl font-semibold text-text-primary mr-2">
                              {metrics.averageRating.toFixed(1)}
                            </span>
                            <div className="flex">
                              {renderStars(metrics.averageRating)}
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-text-secondary">Goal Completion</p>
                          <div className="flex items-center mt-1">
                            <span className="text-2xl font-semibold text-text-primary">
                              {metrics.completedGoals}
                            </span>
                            <span className="text-sm text-text-secondary ml-2">
                              / {metrics.completedGoals + metrics.pendingGoals} goals
                            </span>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-text-secondary">Reviews Completed</p>
                          <p className="text-2xl font-semibold text-text-primary mt-1">
                            {metrics.reviewCount}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Additional analytics components can be added here */}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;