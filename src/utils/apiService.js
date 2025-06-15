import useSWR from "swr";
import { useEffect } from "react";

const url = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const fetcher = async (url, options) => {
    const res = await fetch(url, options);
    if(!res.ok) {
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
    });
    const data = await res.json();
  } catch (error) {
    console.error("Login Error:", error);
  }
};

export const useLoadUser = () => {
  const { data, error, isLoading, mutate } = useSWR([`${url}/auth/me`, { credentials: "include" }], fetcher);

  // Custom logic for 401 and refresh
  useEffect(() => {
    let didRefresh = false;
    const tryRefresh = async () => {
      if (error?.status === 401 && !didRefresh) {
        didRefresh = true;
        // Call refresh endpoint
        const refreshRes = await fetch(`${url}/auth/refresh-token`, { credentials: "include" });
        if (refreshRes.ok) {
          // Retry /auth/me after refresh
          mutate();
        }
      }
    };
    tryRefresh();
  }, [error, mutate]);

  return {
    user: data,
    error,
    isLoading,
  };
};