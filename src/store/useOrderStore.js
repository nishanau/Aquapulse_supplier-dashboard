import { create } from "zustand";
import { useOrders } from "@/utils/apiService";
export const useOrderStore = create((set) => ({
  orders: [],
  isLoading: false,
  error: null,
  
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error, isLoading } = useOrders();
      if (error) {
        throw new Error(error);
      }
      set({ orders: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  clearOrders: () => set({ orders: [] }),
}));