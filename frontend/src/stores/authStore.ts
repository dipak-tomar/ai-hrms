import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
  department: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock successful login
          const mockUser: User = {
            id: '1',
            email,
            name: 'John Doe',
            role: email.includes('admin') ? 'admin' : email.includes('manager') ? 'manager' : 'employee',
            department: 'Engineering',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
          };
          
          const mockToken = 'mock-jwt-token-' + Date.now();
          
          set({ user: mockUser, token: mockToken, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw new Error('Login failed');
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const newUser: User = {
            id: Date.now().toString(),
            email: userData.email,
            name: userData.name,
            role: userData.role,
            department: userData.department,
          };
          
          const mockToken = 'mock-jwt-token-' + Date.now();
          
          set({ user: newUser, token: mockToken, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw new Error('Registration failed');
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);