import React from 'react';
import { BarChart3, Download } from 'lucide-react';

const PerformanceReport: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Performance Report</h2>
          <p className="text-gray-600">Track employee performance and reviews</p>
        </div>
        <div className="flex space-x-2">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Report</h3>
        <p className="text-gray-500">Performance reporting functionality will be implemented here</p>
      </div>
    </div>
  );
};

export default PerformanceReport;