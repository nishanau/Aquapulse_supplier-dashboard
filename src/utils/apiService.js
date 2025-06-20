"use client";
import useSWR from "swr";
import { useEffect, useState } from "react";

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

export const useOrders = () => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      credentials: "include", // Include cookies for authentication
    },
  };

  const { data, error, isLoading } = useSWR(
    [`${url}/orders`, options],
    fetcher
  );
  console.log("Data fetched from API:", data);
  console.log("Error fetching data:", error);
  console.log("Is loading:", isLoading);

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
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Login Error:", error);
  }
};

export const handleLogout = async () => {
  try {
    const res = await fetch(`${url}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

export const useLoadUser = () => {
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

  const { data, error, isLoading } = useSWR(
    `${url}/auth/me`,
    (url) =>
      fetch(url, { credentials: "include" }).then((res) => {
        if (!res.ok) {
          const error = new Error("An error occurred while fetching the data.");
          error.status = res.status;
          error.statusText = res.statusText;
          throw error;
        }
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
      shouldRetryOnError: false, // Don't retry on errors
      //errorRetryCount: 3, // Retry only three times
      dedupingInterval: 10000, // Reduce duplicate requests
      revalidateOnFocus: false, // Don't reload when tab gains focus
      revalidateOnReconnect: true, // When coming back online, revalidate
    }
  );

  return {
    user: data,
    error,
    isLoading,
    isOnline, // Return online status so components can show appropriate UI
  };
};
