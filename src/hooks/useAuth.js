import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLoadUser } from "@/utils/apiService";

export const useAuth = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const setIsAuthenticated = useAuthStore((s) => s.setIsAuthenticated);
  const { user, isLoading, error } = useLoadUser();

  useEffect(() => {
    if (user) {
      setUser(user);
      setIsAuthenticated(true);
      console.log("User data:", user);
    } else if (!isLoading && error) {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [setUser, setIsAuthenticated]);
};
