import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticaed: false,
  setIsAuthenticated: (auth) => set({ isAuthenticaed: auth }),
  setUser: (user) => set({ user }),
}));
