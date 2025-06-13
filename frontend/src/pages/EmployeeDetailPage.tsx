import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Download, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useEmployeeStore } from '../stores/employeeStore';
import Card from '../components/Card';
import Button from '../components/Button';
import clsx from 'clsx';

const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentEmployee, isLoading, fetchEmployee } = useEmployeeStore();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchEmployee(id);
    }
  }, [id, fetchEmployee]);

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'payroll', name: 'Payroll' },
    { id: 'attendance', name: 'Attendance' },
    { id: 'performance', name: 'Performance' },
    { id: 'documents', name: 'Documents' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentEmployee) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Employee not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/employees"
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary">
              {currentEmployee.name}
            </h1>
            <p className="text-text-secondary">{currentEmployee.designation}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Employee Profile Card */}
      <Card>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <img
              className="h-24 w-24 rounded-full"
              src={currentEmployee.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'}
              alt={currentEmployee.name}
            />
            <div className="flex-1">
              <h2 className="text-xl font-heading font-semibold text-text-primary">
                {currentEmployee.name}
              </h2>
              <p className="text-text-secondary mb-2">{currentEmployee.designation}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center text-text-secondary">
                  <Mail className="w-4 h-4 mr-2" />
                  {currentEmployee.email}
                </div>
                <div className="flex items-center text-text-secondary">
                  <Phone className="w-4 h-4 mr-2" />
                  {currentEmployee.phone || 'Not provided'}
                </div>
                <div className="flex items-center text-text-secondary">
                  <MapPin className="w-4 h-4 mr-2" />
                  {currentEmployee.department}
                </div>
                <div className="flex items-center text-text-secondary">
                  <Calendar className="w-4 h-4 mr-2" />
                  Joined {new Date(currentEmployee.joinDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <span className={clsx(
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                currentEmployee.status === 'active' ? 'bg-success/10 text-success' :
                currentEmployee.status === 'inactive' ? 'bg-warning/10 text-warning' :
                'bg-danger/10 text-danger'
              )}>
                {currentEmployee.status.charAt(0).toUpperCase() + currentEmployee.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </Card>

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
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Employee ID:</span>
                      <span className="text-text-primary">EMP-{currentEmployee.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Full Name:</span>
                      <span className="text-text-primary">{currentEmployee.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Email:</span>
                      <span className="text-primary">{currentEmployee.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Phone:</span>
                      <span className="text-text-primary">{currentEmployee.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Address:</span>
                      <span className="text-text-primary">{currentEmployee.address || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                    Job Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Designation:</span>
                      <span className="text-text-primary">{currentEmployee.designation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Department:</span>
                      <span className="text-text-primary">{currentEmployee.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Join Date:</span>
                      <span className="text-text-primary">
                        {new Date(currentEmployee.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Reporting Manager:</span>
                      <span className="text-text-primary">{currentEmployee.reportingManager || 'Not assigned'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Status:</span>
                      <span className={clsx(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        currentEmployee.status === 'active' ? 'bg-success/10 text-success' :
                        currentEmployee.status === 'inactive' ? 'bg-warning/10 text-warning' :
                        'bg-danger/10 text-danger'
                      )}>
                        {currentEmployee.status.charAt(0).toUpperCase() + currentEmployee.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'payroll' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                  Payroll History
                </h3>
                <p className="text-text-secondary">Payroll information will be displayed here.</p>
              </div>
            </Card>
          )}

          {activeTab === 'attendance' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                  Attendance Record
                </h3>
                <p className="text-text-secondary">Attendance information will be displayed here.</p>
              </div>
            </Card>
          )}

          {activeTab === 'performance' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                  Performance Reviews
                </h3>
                <p className="text-text-secondary">Performance information will be displayed here.</p>
              </div>
            </Card>
          )}

          {activeTab === 'documents' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                  Documents
                </h3>
                <p className="text-text-secondary">Document management will be displayed here.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPage;