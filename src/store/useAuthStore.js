import { create } from "zustand";
import { handleLogout, patchUser } from "@/utils/apiService";

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isOnline: true,
  isLoading: false,
  setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
  setUser: (user) => set({ user }),
  setIsOnline: (status) => set({ isOnline: status }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  updateUser: async (userData) => {
    try {
      // Get current user ID
      const currentUser = get().user;
      if (!currentUser) {
        throw new Error("No user found to update");
      }

      // Call API to update user
      const updatedUser = await patchUser(userData);

      // Update state with API response
      set({
        user: updatedUser,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error; // Re-throw to allow caller to handle errors
    }
  },
  logout: async () => {
    try {
      const res = await handleLogout();
      // Clear user data and authentication status
      set({ user: null, isAuthenticated: false });
      return true;
    } catch (error) {
      console.error("Logout Error:", error);
    }
  },
}));
