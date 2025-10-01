import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { api } from '@/lib/api-client';
import type { User } from '@shared/types';
const USER_STORAGE_KEY = 'clarity-ai-user';
type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  signup: (details: Omit<User, 'id' | 'role'>) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  updateUser: (updatedUser: User) => void;
};
export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    login: async (credentials) => {
      set({ isLoading: true, error: null });
      try {
        const user = await api<User>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
        });
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        set({ user, isAuthenticated: true, isLoading: false });
        return true;
      } catch (error: any) {
        const errorMessage = error.message || 'Login failed. Please check your credentials.';
        set({ error: errorMessage, isLoading: false });
        return false;
      }
    },
    signup: async (details) => {
      set({ isLoading: true, error: null });
      try {
        const user = await api<User>('/api/auth/signup', {
          method: 'POST',
          body: JSON.stringify(details),
        });
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        set({ user, isAuthenticated: true, isLoading: false });
        return true;
      } catch (error: any) {
        const errorMessage = error.message || 'Signup failed. Please try again.';
        set({ error: errorMessage, isLoading: false });
        return false;
      }
    },
    logout: async () => {
      set({ isLoading: true });
      try {
        await api('/api/auth/logout', { method: 'POST' });
      } catch (error) {
        console.error("Logout failed on server, proceeding with client-side logout.", error);
      } finally {
        localStorage.removeItem(USER_STORAGE_KEY);
        set({ user: null, isAuthenticated: false, isLoading: false, error: null });
      }
    },
    checkAuth: () => {
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          const user = JSON.parse(storedUser) as User;
          set({ user, isAuthenticated: true, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      } catch (error) {
        console.error("Failed to parse user from storage", error);
        localStorage.removeItem(USER_STORAGE_KEY);
        set({ isLoading: false });
      }
    },
    updateUser: (updatedUser) => {
      set((state) => {
        state.user = updatedUser;
      });
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    },
  }))
);
// Initialize auth state on app load
useAuthStore.getState().checkAuth();