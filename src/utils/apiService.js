import useSWR from "swr";
import { useEffect, useRef, useState } from "react";

const url = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const fetcher = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.status = res.status;
    error.statusText = res.statusText;
    throw error;
  }
  return res.json();
};

export const useOrders = (token) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const { data, error, isLoading } = useSWR(
    [`${url}/orders`, options],
    fetcher
  );

  return {
    data,
    error,
    isLoading,
  };
};

export const handleLogin = async (email, password) => {
  try {
    const res = await fetch(`${url}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include" 
    });
    const data = await res.json();
    
  } catch (error) {
    console.error("Login Error:", error);
  }
};

export const useLoadUser = () => {
  const didRefresh = useRef(false);
  const [isOnline, setIsOnline] = useState(true);

  // Track online status
  useEffect(() => {
    const handleOnline = () => {
      console.log("Connection restored");
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log("Connection lost");
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const { data, error, isLoading, mutate } = useSWR(
    `${url}/auth/me`,
    (url) =>
      fetch(url, { credentials: "include" }).then((res) => {
        if (!res.ok) {
          const error = new Error("An error occurred while fetching the data.");
          error.status = res.status;
          error.statusText = res.statusText;
          throw error;
        }
        console.log("Login Response:", res.json());
        return res.json();
      }),
    {
      // Don't attempt revalidation when offline
      isPaused: () => !isOnline,
      onError: (err) => {
        if (!navigator.onLine) {
          console.log("Request failed - you are offline");
        }
      },
      // When coming back online, revalidate
      revalidateOnReconnect: true,
    }
  );

  // Custom logic for 401 and refresh
  useEffect(() => {
    const tryRefresh = async () => {
      // Only try refresh if we're online and have a 401 error
      if (isOnline && error?.status === 401 && !didRefresh.current) {
        console.log("Attempting token refresh...");
        didRefresh.current = true;

        try {
          const refreshRes = await fetch(`${url}/auth/refresh-token`, {
            credentials: "include",
          });

          if (refreshRes.ok) {
            console.log("Token refreshed successfully");
            mutate();
          } else {
            console.log("Token refresh failed:", refreshRes.status);
          }
        } catch (err) {
          if (!navigator.onLine) {
            console.log("Refresh failed - you are offline");
          } else {
            console.error("Error during refresh:", err);
          }
        }
      }
    };

    tryRefresh();
  }, [error, mutate, isOnline]);

  return {
    user: data,
    error,
    isLoading,
    isOnline, // Return online status so components can show appropriate UI
  };
};
