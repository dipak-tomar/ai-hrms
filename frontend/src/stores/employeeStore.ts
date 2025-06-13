import { create } from 'zustand';

export interface Employee {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  status: 'active' | 'inactive' | 'terminated';
  joinDate: string;
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

// Mock data
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    status: 'active',
    joinDate: '2023-01-15',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    salary: 95000,
    reportingManager: 'John Smith'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    designation: 'Product Manager',
    department: 'Product',
    status: 'active',
    joinDate: '2022-08-20',
    avatar: 'https://images.pexels.com/photos/927451/pexels-photo-927451.jpeg?auto=compress&cs=tinysrgb&w=150',
    salary: 105000,
    reportingManager: 'Lisa Wong'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    designation: 'HR Specialist',
    department: 'Human Resources',
    status: 'active',
    joinDate: '2023-03-10',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150',
    salary: 75000,
    reportingManager: 'David Wilson'
  },
];

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  currentEmployee: null,
  isLoading: false,
  totalCount: 0,

  fetchEmployees: async (page = 1, search = '', filters = {}) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredEmployees = [...mockEmployees];
      
      if (search) {
        filteredEmployees = filteredEmployees.filter(emp =>
          emp.name.toLowerCase().includes(search.toLowerCase()) ||
          emp.email.toLowerCase().includes(search.toLowerCase()) ||
          emp.designation.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      set({ 
        employees: filteredEmployees, 
        totalCount: filteredEmployees.length,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw new Error('Failed to fetch employees');
    }
  },

  fetchEmployee: async (id: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const employee = mockEmployees.find(emp => emp.id === id);
      set({ currentEmployee: employee || null, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw new Error('Failed to fetch employee');
    }
  },

  createEmployee: async (employeeData) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newEmployee: Employee = {
        ...employeeData,
        id: Date.now().toString(),
      };
      
      mockEmployees.push(newEmployee);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw new Error('Failed to create employee');
    }
  },

  updateEmployee: async (id: string, updates: Partial<Employee>) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const index = mockEmployees.findIndex(emp => emp.id === id);
      if (index !== -1) {
        mockEmployees[index] = { ...mockEmployees[index], ...updates };
      }
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw new Error('Failed to update employee');
    }
  },

  deleteEmployee: async (id: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const index = mockEmployees.findIndex(emp => emp.id === id);
      if (index !== -1) {
        mockEmployees.splice(index, 1);
      }
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw new Error('Failed to delete employee');
    }
  },
}));