import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Users } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/Button';
import toast from 'react-hot-toast';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'manager' | 'employee';
  department: string;
  termsAccepted: boolean;
}

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>();

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        password: data.password,
      });
      toast.success('Registration successful!');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary rounded-xl flex items-center justify-center">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-heading font-bold text-text-primary">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-blue-500 transition-colors"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
                Full Name
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                autoComplete="name"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-text-secondary text-text-primary rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-danger">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
                Email address
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
                autoComplete="email"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-text-secondary text-text-primary rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-danger">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-text-primary mb-1">
                  Role
                </label>
                <select
                  {...register('role', { required: 'Role is required' })}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-text-primary rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="">Select role</option>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-danger">{errors.role.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-text-primary mb-1">
                  Department
                </label>
                <select
                  {...register('department', { required: 'Department is required' })}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-text-primary rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-text-secondary text-text-primary rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-text-secondary" />
                  ) : (
                    <Eye className="h-5 w-5 text-text-secondary" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-danger">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-text-secondary text-text-primary rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-text-secondary" />
                  ) : (
                    <Eye className="h-5 w-5 text-text-secondary" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-danger">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              {...register('termsAccepted', { required: 'You must accept the terms and conditions' })}
              id="terms-accepted"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="terms-accepted" className="ml-2 block text-sm text-text-secondary">
              I agree to the{' '}
              <a href="#" className="text-primary hover:text-blue-500 transition-colors">
                Terms and Conditions
              </a>
            </label>
          </div>
          {errors.termsAccepted && (
            <p className="text-sm text-danger">{errors.termsAccepted.message}</p>
          )}

          <div>
            <Button
              type="submit"
              className="group relative w-full"
              size="lg"
              loading={isLoading}
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;