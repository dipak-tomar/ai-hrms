import { create } from 'zustand';
import { employeeService } from '../api/client';

export interface Employee {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  status: 'active' | 'inactive' | 'terminated';
  joinDate: string;
  dateOfJoining?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  salary?: number;
  reportingManager?: string;
}

interface EmployeeState {
  employees: Employee[];
  currentEmployee: Employee | null;
  isLoading: boolean;
  totalCount: number;
  fetchEmployees: (page?: number, search?: string, filters?: any) => Promise<void>;
  fetchEmployee: (id: string) => Promise<void>;
  createEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (id: string, updates: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  currentEmployee: null,
  isLoading: false,
  totalCount: 0,

  fetchEmployees: async (page = 1, search = '', filters = {}) => {
    set({ isLoading: true });
    try {
      const params = {
        page,
        search,
        ...filters
      };
      
      const response = await employeeService.getEmployees(params);
      
      set({ 
        employees: response.data, 
        totalCount: response.total,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch employees:', error);
      // Keep the existing employees in the store on error
    }
  },

  fetchEmployee: async (id: string) => {
    set({ isLoading: true });
    try {
      const employee = await employeeService.getEmployee(id);
      set({ currentEmployee: employee, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch employee:', error);
    }
  },

  createEmployee: async (employeeData) => {
    set({ isLoading: true });
    try {
      await employeeService.createEmployee(employeeData);
      // Refresh the employee list after creating a new employee
      get().fetchEmployees();
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to create employee:', error);
      throw error;
    }
  },

  updateEmployee: async (id: string, updates: Partial<Employee>) => {
    set({ isLoading: true });
    try {
      await employeeService.updateEmployee(id, updates);
      
      // Update the current employee if it's the one being edited
      if (get().currentEmployee?.id === id) {
        set({ 
          currentEmployee: { ...get().currentEmployee!, ...updates } 
        });
      }
      
      // Update the employee in the list if it exists
      set({
        employees: get().employees.map(emp => 
          emp.id === id ? { ...emp, ...updates } : emp
        )
      });
      
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to update employee:', error);
      throw error;
    }
  },

  deleteEmployee: async (id: string) => {
    set({ isLoading: true });
    try {
      await employeeService.deleteEmployee(id);
      
      // Remove the employee from the list
      set({
        employees: get().employees.filter(emp => emp.id !== id)
      });
      
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to delete employee:', error);
      throw error;
    }
  },
}));