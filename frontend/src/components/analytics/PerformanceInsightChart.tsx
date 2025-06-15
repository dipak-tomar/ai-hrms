import React from 'react';
import { TrendingUp, TrendingDown, Target, Award, AlertCircle } from 'lucide-react';
import { PerformanceInsight } from '../../api/analytics';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import Card from '../Card';

interface PerformanceInsightChartProps {
  insights: PerformanceInsight[];
  departmentFilter?: string;
}

const PerformanceInsightChart: React.FC<PerformanceInsightChartProps> = ({
  insights,
  departmentFilter
}) => {
  // Filter insights by department if specified
  const filteredInsights = departmentFilter 
    ? insights.filter(insight => insight.department === departmentFilter)
    : insights;

  // Calculate aggregate metrics
  const totalEmployees = filteredInsights.length;
  const averageScore = totalEmployees > 0 
    ? filteredInsights.reduce((sum, insight) => sum + insight.overallScore, 0) / totalEmployees 
    : 0;
  const averageGoalCompletion = totalEmployees > 0
    ? filteredInsights.reduce((sum, insight) => sum + insight.goalCompletionRate, 0) / totalEmployees
    : 0;

  // Categorize performance levels
  const highPerformers = filteredInsights.filter(insight => insight.overallScore >= 85).length;
  const averagePerformers = filteredInsights.filter(insight => insight.overallScore >= 70 && insight.overallScore < 85).length;
  const needsImprovement = filteredInsights.filter(insight => insight.overallScore < 70).length;

  // Trend analysis
  const improvingTrend = filteredInsights.filter(insight => insight.ratingTrend === 'IMPROVING').length;
  const decliningTrend = filteredInsights.filter(insight => insight.ratingTrend === 'DECLINING').length;
  const stableTrend = filteredInsights.filter(insight => insight.ratingTrend === 'STABLE').length;

  // Performance distribution data for chart
  const performanceDistribution = [
    { category: 'Excellent (85+)', count: highPerformers, percentage: (highPerformers / totalEmployees) * 100 },
    { category: 'Good (70-84)', count: averagePerformers, percentage: (averagePerformers / totalEmployees) * 100 },
    { category: 'Needs Improvement (<70)', count: needsImprovement, percentage: (needsImprovement / totalEmployees) * 100 }
  ];

  // Goal completion trend data
  const goalCompletionData = filteredInsights.map((insight) => ({
    employee: insight.employeeName.split(' ')[0], // First name only for chart
    score: insight.overallScore,
    goalCompletion: insight.goalCompletionRate,
    department: insight.department
  }));

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'IMPROVING': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'DECLINING': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Target className="w-4 h-4 text-gray-500" />;
    }
  };



  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Average Score</p>
              <p className="text-2xl font-bold text-text-primary">{averageScore.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">High Performers</p>
              <p className="text-2xl font-bold text-text-primary">{highPerformers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Goal Completion</p>
              <p className="text-2xl font-bold text-text-primary">{averageGoalCompletion.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Needs Support</p>
              <p className="text-2xl font-bold text-text-primary">{needsImprovement}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Distribution */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="category" stroke="#6B778C" fontSize={12} />
                  <YAxis stroke="#6B778C" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  <Bar dataKey="count" fill="#0052CC" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Performance vs Goal Completion */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance vs Goal Completion</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={goalCompletionData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="employee" stroke="#6B778C" fontSize={12} />
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
                    dataKey="score" 
                    stroke="#0052CC" 
                    strokeWidth={2}
                    name="Performance Score"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="goalCompletion" 
                    stroke="#36B37E" 
                    strokeWidth={2}
                    name="Goal Completion"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      {/* Trend Analysis */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{improvingTrend}</div>
              <div className="text-sm text-text-secondary">Improving</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Target className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-600">{stableTrend}</div>
              <div className="text-sm text-text-secondary">Stable</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{decliningTrend}</div>
              <div className="text-sm text-text-secondary">Declining</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Top Performers and Needs Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
            <div className="space-y-3">
              {filteredInsights
                .filter(insight => insight.overallScore >= 85)
                .sort((a, b) => b.overallScore - a.overallScore)
                .slice(0, 5)
                .map((insight, index) => (
                  <div key={insight.employeeId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">{insight.employeeName}</div>
                        <div className="text-sm text-text-secondary">{insight.department}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{insight.overallScore}%</div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(insight.ratingTrend)}
                        <span className="text-xs text-text-secondary">{insight.ratingTrend}</span>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </Card>

        {/* Needs Attention */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Needs Attention</h3>
            <div className="space-y-3">
              {filteredInsights
                .filter(insight => insight.overallScore < 70 || insight.ratingTrend === 'DECLINING')
                .sort((a, b) => a.overallScore - b.overallScore)
                .slice(0, 5)
                .map((insight) => (
                  <div key={insight.employeeId} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">{insight.employeeName}</div>
                        <div className="text-sm text-text-secondary">{insight.department}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">{insight.overallScore}%</div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(insight.ratingTrend)}
                        <span className="text-xs text-text-secondary">{insight.ratingTrend}</span>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceInsightChart; 