import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, User, Briefcase, CreditCard, Upload } from 'lucide-react';
import { useEmployeeStore } from '../stores/employeeStore';
import Card from '../components/Card';
import Button from '../components/Button';
import toast from 'react-hot-toast';

interface EmployeeForm {
  // Personal Info
  name: string;
  email: string;
  phone: string;
  address: string;
  
  // Job Details
  designation: string;
  department: string;
  reportingManager: string;
  joinDate: string;
  
  // Salary Details
  salary: number;
  bankAccount: string;
  ifscCode: string;
}

const NewEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  const { createEmployee, isLoading } = useEmployeeStore();
  const { register, handleSubmit, formState: { errors }, trigger } = useForm<EmployeeForm>();
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, name: 'Personal Info', icon: User },
    { id: 2, name: 'Job Details', icon: Briefcase },
    { id: 3, name: 'Salary & Bank', icon: CreditCard },
    { id: 4, name: 'Documents', icon: Upload },
  ];

  const nextStep = async () => {
    let fieldsToValidate: (keyof EmployeeForm)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['name', 'email', 'phone', 'address'];
        break;
      case 2:
        fieldsToValidate = ['designation', 'department', 'joinDate'];
        break;
      case 3:
        fieldsToValidate = ['salary', 'bankAccount', 'ifscCode'];
        break;
    }
    
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: EmployeeForm) => {
    try {
      await createEmployee({
        name: data.name,
        email: data.email,
        designation: data.designation,
        department: data.department,
        status: 'active',
        joinDate: data.joinDate,
        phone: data.phone,
        address: data.address,
        salary: data.salary,
        reportingManager: data.reportingManager,
      });
      toast.success('Employee created successfully!');
      navigate('/employees');
    } catch (error) {
      toast.error('Failed to create employee');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/employees"
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Add New Employee</h1>
          <p className="text-text-secondary">Complete the onboarding process</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <div className="p-4 sm:p-6">
          <nav aria-label="Progress">
            <ol className="flex items-center overflow-x-auto">
              {steps.map((step, stepIdx) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                
                return (
                  <li key={step.name} className="relative flex-1 min-w-0">
                    <div className="flex items-center">
                      <div className={`
                        relative flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0
                        ${isCompleted ? 'bg-primary' : isCurrent ? 'bg-primary' : 'bg-gray-200'}
                      `}>
                        <Icon className={`h-4 w-4 ${
                          isCompleted || isCurrent ? 'text-white' : 'text-gray-500'
                        }`} />
                      </div>
                      <span className={`ml-2 text-sm font-medium truncate ${
                        isCompleted || isCurrent ? 'text-primary' : 'text-text-secondary'
                      }`}>
                        {step.name}
                      </span>
                    </div>
                    {stepIdx !== steps.length - 1 && (
                      <div className="absolute top-4 left-8 w-full h-0.5 bg-gray-200 hidden sm:block">
                        <div className={`h-full transition-all duration-300 ${
                          isCompleted ? 'bg-primary w-full' : 'w-0'
                        }`} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="p-4 sm:p-6">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Full Name *
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="Enter full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-danger">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Email Address *
                    </label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-danger">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Phone Number *
                    </label>
                    <input
                      {...register('phone', { required: 'Phone is required' })}
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="Enter phone number"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-danger">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Address *
                    </label>
                    <input
                      {...register('address', { required: 'Address is required' })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="Enter address"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-danger">{errors.address.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Job Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary">
                  Job Details & Role Assignment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Designation *
                    </label>
                    <input
                      {...register('designation', { required: 'Designation is required' })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="Enter designation"
                    />
                    {errors.designation && (
                      <p className="mt-1 text-sm text-danger">{errors.designation.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Department *
                    </label>
                    <select
                      {...register('department', { required: 'Department is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Select department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Product">Product</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance">Finance</option>
                    </select>
                    {errors.department && (
                      <p className="mt-1 text-sm text-danger">{errors.department.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Reporting Manager
                    </label>
                    <input
                      {...register('reportingManager')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="Enter reporting manager"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Join Date *
                    </label>
                    <input
                      {...register('joinDate', { required: 'Join date is required' })}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                    {errors.joinDate && (
                      <p className="mt-1 text-sm text-danger">{errors.joinDate.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Salary & Bank Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary">
                  Salary & Bank Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Annual Salary *
                    </label>
                    <input
                      {...register('salary', { 
                        required: 'Salary is required',
                        min: { value: 0, message: 'Salary must be positive' },
                      })}
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="Enter annual salary"
                    />
                    {errors.salary && (
                      <p className="mt-1 text-sm text-danger">{errors.salary.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Bank Account Number *
                    </label>
                    <input
                      {...register('bankAccount', { required: 'Bank account is required' })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="Enter bank account number"
                    />
                    {errors.bankAccount && (
                      <p className="mt-1 text-sm text-danger">{errors.bankAccount.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      IFSC Code *
                    </label>
                    <input
                      {...register('ifscCode', { required: 'IFSC code is required' })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="Enter IFSC code"
                    />
                    {errors.ifscCode && (
                      <p className="mt-1 text-sm text-danger">{errors.ifscCode.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Document Upload */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-heading font-semibold text-text-primary">
                  Document Upload
                </h3>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <p className="text-sm text-text-secondary">
                        Drag and drop files here, or{' '}
                        <button type="button" className="text-primary hover:text-blue-500">
                          browse
                        </button>
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        Upload ID proof, address proof, and other relevant documents
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
            <Button
              type="button"
              variant="secondary"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="w-full sm:w-auto"
            >
              Previous
            </Button>
            
            {currentStep < 4 ? (
              <Button type="button" onClick={nextStep} className="w-full sm:w-auto">
                Next
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button type="submit" loading={isLoading} className="w-full sm:w-auto">
                Create Employee
              </Button>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
};

export default NewEmployeePage;