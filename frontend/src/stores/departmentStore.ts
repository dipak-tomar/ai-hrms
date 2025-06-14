import { create } from 'zustand';
import { departmentService } from '../api/client';

export interface Department {
  id: string;
  name: string;
  description: string;
  managerId?: string;
  managerName?: string;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

interface DepartmentState {
  departments: Department[];
  currentDepartment: Department | null;
  isLoading: boolean;
  totalCount: number;
  fetchDepartments: (page?: number, search?: string, filters?: Record<string, unknown>) => Promise<void>;
  fetchDepartment: (id: string) => Promise<void>;
  createDepartment: (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt' | 'employeeCount'>) => Promise<void>;
  updateDepartment: (id: string, updates: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
}

export const useDepartmentStore = create<DepartmentState>((set, get) => ({
  departments: [],
  currentDepartment: null,
  isLoading: false,
  totalCount: 0,

  fetchDepartments: async (page = 1, search = '', filters = {}) => {
    set({ isLoading: true });
    try {
      const params = {
        page,
        search,
        ...filters
      };
      
      const response = await departmentService.getDepartments(params);
      
      set({ 
        departments: response.data, 
        totalCount: response.total,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch departments:', error);
      // Keep the existing departments in the store on error
    }
  },

  fetchDepartment: async (id: string) => {
    set({ isLoading: true });
    try {
      const department = await departmentService.getDepartment(id);
      set({ currentDepartment: department, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch department:', error);
    }
  },

  createDepartment: async (departmentData) => {
    set({ isLoading: true });
    try {
      await departmentService.createDepartment(departmentData);
      // Refresh the department list after creating a new department
      get().fetchDepartments();
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to create department:', error);
      throw error;
    }
  },

  updateDepartment: async (id: string, updates: Partial<Department>) => {
    set({ isLoading: true });
    try {
      await departmentService.updateDepartment(id, updates);
      
      // Update the current department if it's the one being edited
      if (get().currentDepartment?.id === id) {
        set({ 
          currentDepartment: { ...get().currentDepartment!, ...updates } 
        });
      }
      
      // Update the department in the list if it exists
      set({
        departments: get().departments.map(dept => 
          dept.id === id ? { ...dept, ...updates } : dept
        )
      });
      
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to update department:', error);
      throw error;
    }
  },

  deleteDepartment: async (id: string) => {
    set({ isLoading: true });
    try {
      await departmentService.deleteDepartment(id);
      
      // Remove the department from the list
      set({
        departments: get().departments.filter(dept => dept.id !== id)
      });
      
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to delete department:', error);
      throw error;
    }
  },
})); 