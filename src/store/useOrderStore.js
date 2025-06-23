import { create } from 'zustand';
import { patchOrder } from '@/utils/apiService';

const useOrderStore = create((set) => ({
  // State
  orders: [],
  
  // Actions
  setOrders: (orders) => set({ orders }),
  
  updateOrder: async (orderId, updates) => {
    try {
      // Make the API call
      const updatedOrder = await patchOrder(orderId, updates);
      
      // Update the local state
      set((state) => ({
        orders: state.orders.map((order) => 
          order._id === orderId ? { ...order, ...updates } : order
        )
      }));
      
      return { success: true, data: updatedOrder };
    } catch (error) {
      console.error('Error updating order:', error);
      return { success: false, error };
    }
  },
  
  // Helper functions
  getOrdersByStatus: (status) => {
    const state = useOrderStore.getState();
    return state.orders.filter(order => 
      Array.isArray(status) ? status.includes(order.status) : order.status === status
    );
  },
  
  getOrderCounts: () => {
    const state = useOrderStore.getState();
    return {
      new: state.orders.filter(order => order.status === "placed").length,
      acknowledged: state.orders.filter(order => order.status === "acknowledged").length,
      scheduled: state.orders.filter(order => order.status === "scheduled").length,
      completed: state.orders.filter(order => order.status === "completed").length,
      total: state.orders.length
    };
  }
}));

export default useOrderStore;