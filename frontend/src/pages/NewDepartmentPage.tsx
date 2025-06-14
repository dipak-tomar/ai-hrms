import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDepartmentStore } from '../stores/departmentStore';
import { useEmployeeStore } from '../stores/employeeStore';
import Card from '../components/Card';
import Button from '../components/Button';
import { ArrowLeft, Save } from 'lucide-react';

const NewDepartmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { createDepartment, isLoading } = useDepartmentStore();
  const { employees, fetchEmployees } = useEmployeeStore();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    managerId: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    // Fetch employees to populate manager selection dropdown
    fetchEmployees();
  }, [fetchEmployees]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    try {
      await createDepartment(formData);
      navigate('/departments');
    } catch (error) {
      console.error('Failed to create department:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center">
          <Button 
            onClick={() => navigate('/departments')} 
            variant="secondary" 
            size="sm" 
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary">
              Create New Department
            </h1>
            <p className="text-text-secondary">Add a new department to your organization</p>
          </div>
        </div>
      </div>

      {/* Department Form */}
      <Card>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Engineering, Marketing, Finance"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the department's purpose and responsibilities"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label htmlFor="managerId" className="block text-sm font-medium text-text-primary mb-1">
                  Department Manager
                </label>
                <select
                  id="managerId"
                  name="managerId"
                  value={formData.managerId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select a manager (optional)</option>
                  {employees
                    .filter(emp => emp.designation?.toLowerCase().includes('manager') || emp.designation?.toLowerCase().includes('director') || emp.designation?.toLowerCase().includes('head'))
                    .map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} ({employee.designation})
                      </option>
                    ))}
                </select>
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <Button 
                  type="button"
                  onClick={() => navigate('/departments')} 
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving || isLoading || !formData.name.trim()}
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Create Department
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default NewDepartmentPage; 