import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLoadUser } from "@/utils/apiService";

export const useAuth = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const setIsAuthenticated = useAuthStore((s) => s.setIsAuthenticated);
  const setIsLoading = useAuthStore((s) => s.setIsLoading);
  const { user, isLoading, error } = useLoadUser();
    
  useEffect(() => {
    setIsLoading(isLoading);
    if (user) {
      setUser(user);
      setIsAuthenticated(true);
    } else if (!isLoading && error) {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [user, isLoading, error, setUser, setIsAuthenticated, setIsLoading]);
};
