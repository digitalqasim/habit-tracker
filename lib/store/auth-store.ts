import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signIn, signUp, signOut, getUser } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      register: async (email, password) => {
        const { data, error } = await signUp(email, password);
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          set({ user: { id: data.user.id, email: data.user.email! } });
        }
        return { success: true };
      },
      login: async (email, password) => {
        const { data, error } = await signIn(email, password);
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          set({ user: { id: data.user.id, email: data.user.email! } });
        }
        return { success: true };
      },
      logout: async () => {
        await signOut();
        set({ user: null });
      },
      checkAuth: async () => {
        const { user, error } = await getUser();
        if (error || !user) {
          set({ user: null });
          return;
        }
        set({ user: { id: user.id, email: user.email! } });
      },
    }),
    { name: 'auth-storage' }
  )
); 