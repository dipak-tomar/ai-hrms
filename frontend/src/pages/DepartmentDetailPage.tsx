import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDepartmentStore } from '../stores/departmentStore';
import { useEmployeeStore } from '../stores/employeeStore';
import Card from '../components/Card';
import Button from '../components/Button';
import { ArrowLeft, Save, Trash2, Users } from 'lucide-react';

const DepartmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentDepartment, isLoading, fetchDepartment, updateDepartment, deleteDepartment } = useDepartmentStore();
  const { employees, fetchEmployees } = useEmployeeStore();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    managerId: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchDepartment(id);
      fetchEmployees(1, '', { department: id });
    }
  }, [id, fetchDepartment, fetchEmployees]);
  
  useEffect(() => {
    if (currentDepartment) {
      setFormData({
        name: currentDepartment.name,
        description: currentDepartment.description,
        managerId: currentDepartment.managerId || ''
      });
    }
  }, [currentDepartment]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSaving(true);
    try {
      await updateDepartment(id, formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update department:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      try {
        await deleteDepartment(id);
        navigate('/departments');
      } catch (error) {
        console.error('Failed to delete department:', error);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!currentDepartment && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg font-medium text-text-primary mb-2">Department not found</p>
        <Button onClick={() => navigate('/departments')} variant="secondary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Departments
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center">
          <Button 
            onClick={() => navigate('/departments')} 
            variant="ghost" 
            size="sm" 
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-primary">
              {isEditing ? 'Edit Department' : currentDepartment?.name}
            </h1>
            {!isEditing && (
              <p className="text-text-secondary">Department details and employees</p>
            )}
          </div>
        </div>
        <div className="flex space-x-3">
          {!isEditing ? (
            <>
              <Button onClick={() => setIsEditing(true)} variant="secondary" size="sm">
                Edit Department
              </Button>
              <Button onClick={handleDelete} variant="danger" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditing(false)} variant="secondary" size="sm">
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                size="sm" 
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Department Details */}
      <Card>
        <div className="p-6">
          {isEditing ? (
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
                    <option value="">Select a manager</option>
                    {employees
                      .filter(emp => emp.role === 'manager' || emp.role === 'admin')
                      .map(employee => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} ({employee.designation})
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-text-secondary">Department Name</h3>
                <p className="mt-1 text-text-primary">{currentDepartment?.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-text-secondary">Description</h3>
                <p className="mt-1 text-text-primary whitespace-pre-wrap">{currentDepartment?.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-text-secondary">Department Manager</h3>
                <p className="mt-1 text-text-primary">
                  {currentDepartment?.managerName || 'No manager assigned'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-text-secondary">Created At</h3>
                <p className="mt-1 text-text-primary">
                  {new Date(currentDepartment?.createdAt || '').toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-text-secondary">Last Updated</h3>
                <p className="mt-1 text-text-primary">
                  {new Date(currentDepartment?.updatedAt || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Department Employees */}
      {!isEditing && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-text-primary flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Department Employees
              </h2>
              <span className="bg-gray-100 text-text-secondary px-2 py-1 rounded-full text-xs font-medium">
                {currentDepartment?.employeeCount || 0} employees
              </span>
            </div>
            
            {employees.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {employees.map(employee => (
                  <div key={employee.id} className="py-3 flex items-center">
                    <img
                      src={employee.avatar || 'https://via.placeholder.com/40'}
                      alt={employee.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="text-sm font-medium text-text-primary">{employee.name}</p>
                      <p className="text-xs text-text-secondary">{employee.designation}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-center py-4">
                No employees in this department yet
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default DepartmentDetailPage; 