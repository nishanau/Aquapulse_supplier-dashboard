import { create } from "zustand";
import { handleLogout } from "@/utils/apiService";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isOnline:true,
  isLoading: false,
  setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
  setUser: (user) => set({ user }),
  setIsOnline: (status) => set({isOnline: status}),
  setIsLoading: (loading) => set({isLoading: loading}),
  logout: async () => {
    try {
      const res = await handleLogout();
      // Clear user data and authentication status
      set({ user: null, isAuthenticated: false });
      return true;
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }
}));
