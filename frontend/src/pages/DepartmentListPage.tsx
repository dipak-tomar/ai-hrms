import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Download, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useDepartmentStore } from '../stores/departmentStore';
import Card from '../components/Card';
import Button from '../components/Button';
import clsx from 'clsx';

const DepartmentListPage: React.FC = () => {
  const { departments, isLoading, fetchDepartments } = useDepartmentStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDepartments(1, searchTerm);
  }, [searchTerm, fetchDepartments]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Departments</h1>
          <p className="text-text-secondary">Manage your organization's departments</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button variant="secondary" size="sm" className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link to="/departments/new" className="w-full sm:w-auto">
            <Button size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Department
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col space-y-4">
            {/* Search */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Department Table/Cards */}
      <Card padding="none">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Department Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Manager
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Employees
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departments.map((department) => (
                    <tr key={department.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-text-primary">
                          {department.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-text-secondary line-clamp-2">
                          {department.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {department.managerName || 'Not assigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {department.employeeCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/departments/${department.id}`}
                            className="text-primary hover:text-blue-700 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            className="text-text-secondary hover:text-danger transition-colors"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete ${department.name}?`)) {
                                useDepartmentStore.getState().deleteDepartment(department.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="text-text-secondary hover:text-text-primary transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {departments.map((department) => (
                <div key={department.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {department.name}
                        </p>
                      </div>
                      <p className="text-sm text-text-secondary truncate mt-1">
                        {department.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-text-secondary">
                          Manager: {department.managerName || 'Not assigned'}
                        </p>
                        <p className="text-xs text-text-secondary">
                          Employees: {department.employeeCount}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        to={`/departments/${department.id}`}
                        className="text-primary hover:text-blue-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        className="text-text-secondary hover:text-danger transition-colors"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${department.name}?`)) {
                            useDepartmentStore.getState().deleteDepartment(department.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {!isLoading && departments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <p className="text-lg font-medium text-text-primary mb-2">No departments found</p>
            <p className="text-text-secondary mb-4">Create your first department to get started</p>
            <Link to="/departments/new">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Department
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DepartmentListPage; 