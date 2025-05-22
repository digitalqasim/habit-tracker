import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { register as apiRegister, login as apiLogin } from '../api';

export type User = { id: string; email: string } | null;

export type AuthState = {
  user: User;
  register: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      register: async (email, password) => {
        const res = await apiRegister(email, password);
        if (res.success) {
          set({ user: { id: res.id, email } });
        }
        return res;
      },
      login: async (email, password) => {
        const res = await apiLogin(email, password);
        if (res.success) {
          set({ user: { id: res.id, email } });
        }
        return res;
      },
      logout: () => set({ user: null }),
    }),
    { name: 'auth-storage' }
  )
); 