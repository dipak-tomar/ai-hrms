import React from 'react';
import { AlertTriangle, User, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { AttritionRiskScore } from '../../api/analytics';
import Card from '../Card';
import Button from '../Button';

interface AttritionRiskCardProps {
  employee: AttritionRiskScore;
  onViewDetails: (employeeId: string) => void;
  onTakeAction: (employeeId: string, action: string) => void;
}

const AttritionRiskCard: React.FC<AttritionRiskCardProps> = ({
  employee,
  onViewDetails,
  onTakeAction
}) => {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getFactorIcon = (impact: string) => {
    switch (impact) {
      case 'POSITIVE': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'NEGATIVE': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getRiskLevelColor(employee.riskLevel)}`}>
              {getRiskIcon(employee.riskLevel)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{employee.employeeName}</h3>
              <p className="text-sm text-text-secondary">{employee.department}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-text-primary">{employee.riskScore}%</div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(employee.riskLevel)}`}>
              {employee.riskLevel} RISK
            </span>
          </div>
        </div>

        {/* Risk Score Visualization */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-text-secondary mb-1">
            <span>Risk Score</span>
            <span>{employee.riskScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                employee.riskScore >= 80 ? 'bg-red-500' :
                employee.riskScore >= 60 ? 'bg-orange-500' :
                employee.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${employee.riskScore}%` }}
            />
          </div>
        </div>

        {/* Top Risk Factors */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-text-secondary mb-2">Top Risk Factors</h4>
          <div className="space-y-2">
            {employee.factors
              .filter(factor => factor.impact === 'NEGATIVE')
              .slice(0, 3)
              .map((factor, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-surface rounded">
                  <div className="flex items-center gap-2">
                    {getFactorIcon(factor.impact)}
                    <span className="text-sm font-medium">{factor.factor}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-text-secondary">{factor.value}%</span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Recommendations Preview */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-text-secondary mb-2">Key Recommendations</h4>
          <div className="space-y-1">
            {employee.recommendations.slice(0, 2).map((recommendation, index) => (
              <div key={index} className="text-sm text-text-primary bg-blue-50 p-2 rounded">
                • {recommendation}
              </div>
            ))}
            {employee.recommendations.length > 2 && (
              <div className="text-sm text-text-secondary">
                +{employee.recommendations.length - 2} more recommendations
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-border">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onViewDetails(employee.employeeId)}
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onTakeAction(employee.employeeId, 'schedule_meeting')}
            className="flex-1"
          >
            Take Action
          </Button>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-text-secondary mt-2 text-center">
          Last updated: {new Date(employee.lastUpdated).toLocaleDateString()}
        </div>
      </div>
    </Card>
  );
};

export default AttritionRiskCard; 