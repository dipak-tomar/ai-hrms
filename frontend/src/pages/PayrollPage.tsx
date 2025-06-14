import React, { useState, useEffect } from 'react';
import { DollarSign, Download, Play, Settings, FileText, Loader } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import clsx from 'clsx';
import { payrollService, Payroll, PayrollReport } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { departmentService } from '../api/client';

interface RunPayrollFormData {
  month: number;
  year: number;
  departmentId?: string;
}

const PayrollPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showRunPayroll, setShowRunPayroll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [payrollData, setPayrollData] = useState<Payroll[]>([]);
  const [payrollReport, setPayrollReport] = useState<PayrollReport | null>(null);
  const [formData, setFormData] = useState<RunPayrollFormData>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [departments, setDepartments] = useState<{id: string, name: string}[]>([]);
  const user = useAuthStore(state => state.user);
  const isHR = user?.role?.includes('HR') || user?.role?.includes('SUPER_ADMIN');

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'salary-structure', name: 'Salary Structure' },
    { id: 'payslips', name: 'Payslips' },
    { id: 'reports', name: 'Reports' },
  ];

  useEffect(() => {
    fetchPayrollData();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const depts = await departmentService.getDepartments();
      setDepartments(depts.map(dept => ({ id: dept.id, name: dept.name })));
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchPayrollData = async () => {
    setIsLoading(true);
    try {
      let payrolls;
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      if (isHR) {
        payrolls = await payrollService.getAllPayrolls({
          month: currentMonth,
          year: currentYear
        });
        
        // Fetch payroll report
        const report = await payrollService.getPayrollReport({
          month: currentMonth,
          year: currentYear
        });
        setPayrollReport(report);
      } else {
        payrolls = await payrollService.getMyPayroll({
          month: currentMonth,
          year: currentYear
        });
      }
      
      setPayrollData(payrolls);
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      toast.error('Failed to load payroll data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunPayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await payrollService.generatePayrolls({
        month: formData.month,
        year: formData.year,
        departmentId: formData.departmentId
      });
      
      toast.success('Payroll generated successfully');
      setShowRunPayroll(false);
      fetchPayrollData();
    } catch (error) {
      console.error('Error generating payroll:', error);
      toast.error('Failed to generate payroll');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovePayroll = async (id: string) => {
    try {
      await payrollService.approvePayroll(id);
      toast.success('Payroll approved successfully');
      fetchPayrollData();
    } catch (error) {
      console.error('Error approving payroll:', error);
      toast.error('Failed to approve payroll');
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      await payrollService.markAsPaid(id);
      toast.success('Payroll marked as paid');
      fetchPayrollData();
    } catch (error) {
      console.error('Error marking payroll as paid:', error);
      toast.error('Failed to mark payroll as paid');
    }
  };

  const handleGeneratePayslip = async (id: string) => {
    try {
      // Generate the payslip but don't assign to variable since we're not using it here
      await payrollService.generatePayslip(id);
      // In a real application, you would handle the payslip data
      // For example, open it in a new window or download it
      toast.success('Payslip generated successfully');
    } catch (error) {
      console.error('Error generating payslip:', error);
      toast.error('Failed to generate payslip');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'month' || name === 'year' ? parseInt(value) : value
    }));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      DRAFT: 'bg-gray-100 text-gray-800',
      PENDING: 'bg-warning/10 text-warning',
      APPROVED: 'bg-success/10 text-success',
      REJECTED: 'bg-danger/10 text-danger',
      PAID: 'bg-primary/10 text-primary',
    };
    
    return (
      <span className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        styles[status as keyof typeof styles] || styles.PENDING
      )}>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Payroll</h1>
          <p className="text-text-secondary">Manage salary structures and process payroll</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {isHR && (
            <Button size="sm" onClick={() => setShowRunPayroll(true)}>
              <Play className="w-4 h-4 mr-2" />
              Run Payroll
            </Button>
          )}
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
              label: 'Total Payroll', 
              value: payrollReport ? formatCurrency(payrollReport.totalPayroll) : '$0.00', 
              change: '+2.5%', 
              color: 'primary' 
            },
            { 
              label: 'Employees Paid', 
              value: payrollReport ? payrollReport.totalEmployees.toString() : '0', 
              change: '+5.2%', 
              color: 'success' 
            },
            { 
              label: 'Pending Payrolls', 
              value: payrollData.filter(p => p.status === 'PENDING').length.toString(), 
              change: '-1.2%', 
              color: 'warning' 
            },
            { 
              label: 'Average Salary', 
              value: payrollReport ? formatCurrency(payrollReport.averageSalary) : '$0.00', 
              change: '+3.1%', 
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
                  <DollarSign className="w-8 h-8 text-primary/20" />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Run Payroll Form */}
      {showRunPayroll && (
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-heading font-semibold text-text-primary">
                Run Payroll
              </h3>
              <button 
                onClick={() => setShowRunPayroll(false)}
                className="text-text-secondary hover:text-danger"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleRunPayroll} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Month
                  </label>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    required
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>
                        {new Date(2000, month - 1, 1).toLocaleDateString('en-US', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Year
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    required
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Department (Optional)
                </label>
                <select
                  name="departmentId"
                  value={formData.departmentId || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setShowRunPayroll(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Generate Payroll
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
          {activeTab === 'overview' && (
            <Card padding="none">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-heading font-semibold text-text-primary">
                  Current Month Payroll
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
                          Basic Salary
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Allowances
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Deductions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Net Salary
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
                      {payrollData.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                            No payroll records found
                          </td>
                        </tr>
                      ) : (
                        payrollData.map((record) => {
                          const totalAllowances = record.allowances.reduce((sum, item) => sum + item.amount, 0);
                          const totalDeductions = record.deductions.reduce((sum, item) => sum + item.amount, 0);
                          
                          return (
                            <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                                {record.employee ? `${record.employee.firstName} ${record.employee.lastName}` : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                                {formatCurrency(record.basicSalary)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-success">
                                +{formatCurrency(totalAllowances)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-danger">
                                -{formatCurrency(totalDeductions)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                                {formatCurrency(record.netSalary)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(record.status)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                  <button 
                                    className="text-primary hover:text-blue-700 transition-colors"
                                    onClick={() => handleGeneratePayslip(record.id)}
                                    title="Generate Payslip"
                                  >
                                    <FileText className="w-4 h-4" />
                                  </button>
                                  
                                  {isHR && record.status === 'PENDING' && (
                                    <button 
                                      className="text-success hover:text-green-700 transition-colors"
                                      onClick={() => handleApprovePayroll(record.id)}
                                      title="Approve"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </button>
                                  )}
                                  
                                  {isHR && record.status === 'APPROVED' && (
                                    <button 
                                      className="text-primary hover:text-blue-700 transition-colors"
                                      onClick={() => handleMarkAsPaid(record.id)}
                                      title="Mark as Paid"
                                    >
                                      <DollarSign className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'salary-structure' && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-heading font-semibold text-text-primary">
                    Salary Structure Builder
                  </h3>
                  <Button size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </div>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-text-secondary">Salary structure configuration will be implemented here</p>
                  <p className="text-sm text-text-secondary mt-2">
                    Define salary components, allowances, and deductions
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'payslips' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-6">
                  Payslip Viewer
                </h3>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-text-secondary">Payslip management will be implemented here</p>
                  <p className="text-sm text-text-secondary mt-2">
                    View, download, and manage employee payslips
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'reports' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-6">
                  Payroll Reports
                </h3>
                {payrollReport ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-text-secondary">Total Payroll</p>
                        <p className="text-xl font-semibold text-text-primary">
                          {formatCurrency(payrollReport.totalPayroll)}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-text-secondary">Total Tax</p>
                        <p className="text-xl font-semibold text-text-primary">
                          {formatCurrency(payrollReport.totalTax)}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-text-secondary">Total Allowances</p>
                        <p className="text-xl font-semibold text-text-primary">
                          {formatCurrency(payrollReport.totalAllowances)}
                        </p>
                      </div>
                    </div>
                    
                    {payrollReport.payrollByDepartment && (
                      <div>
                        <h4 className="text-md font-semibold text-text-primary mb-3">
                          Payroll by Department
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                  Department
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                  Employees
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                  Total Salary
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {payrollReport.payrollByDepartment.map((dept, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-text-primary">
                                    {dept.departmentName}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">
                                    {dept.employeeCount}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-text-primary">
                                    {formatCurrency(dept.totalSalary)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-text-secondary">No report data available</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollPage;