import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../api/client';

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
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Use the API client instead of mock data
          const response = await authService.login(email, password);
          set({ 
            user: response.user, 
            token: response.token, 
            isLoading: false,
            isAuthenticated: true 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          // Use the API client instead of mock data
          const response = await authService.register(userData);
          set({ 
            user: response.user, 
            token: response.token, 
            isLoading: false,
            isAuthenticated: true 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      refreshToken: async () => {
        try {
          const response = await authService.refreshToken();
          set({ token: response.token });
          return response.token;
        } catch (error) {
          // If refresh token fails, log the user out
          get().logout();
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);