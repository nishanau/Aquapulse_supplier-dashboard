"use client";
import useSWR from "swr";
import { useEffect, useState } from "react";

const url = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

export const useOrders = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `${url}/orders`,
    (url) =>
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }).then((res) => {
        if (!res.ok) {
          const error = new Error("An error occurred while fetching the data.");
          error.status = res.status;
          error.statusText = res.statusText;
          throw error;
        }

        return res.json();
      }),
    {
      // Configure SWR options
      errorRetryCount: 1,
      revalidateOnFocus: false,
      dedupingInterval: 10000,
      refreshInterval: 30000,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
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

    if (res.ok) {
      return { data, success: true };
    } else {
      return { data, success: false };
    }
  } catch (error) {
    console.error("Login Error:", error);
    return { error, success: false };
  }
};

export const handleLogout = async () => {
  try {
    const res = await fetch(`${url}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return res.ok;
  } catch (error) {
    console.error("Logout Error:", error);
    return false;
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

export const patchOrder = async (orderId, data) => {
  try {
    const res = await fetch(`${url}/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const result = await res.json();
    console.log("Order updated successfully:", result);
    return result;
  } catch (error) {
    console.error("Error updating order:", error);
  }
};

export const patchUser = async (data) => {
  try {
    const res = await fetch(`${url}/suppliers`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      const error = new Error(errorData.message || "Failed to update profile");
      error.status = res.status;
      throw error;
    }

    const result = await res.json();
    console.log("User updated successfully:", result);
    return result;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // Re-throw to allow caller to handle it
  }
};

export const passwordChange = async (oldPassword, newPassword) => {
  try {
    const res = await fetch(`${url}/auth/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      const error = new Error(errorData.message || "Failed to change password");
      error.status = res.status;
      throw error;
    }

    const result = await res.json();
    console.log("Password changed successfully:", result);
    return result;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error; // Re-throw to allow caller to handle it
  }
};

export const registerSupplier = async (supplierData) => {
  try {
    const res = await fetch(`${url}/auth/register-supplier`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(supplierData),
    });

    const data = await res.json();

    if (res.ok) {
      return { data, success: true };
    } else {
      return { data, success: false };
    }
  } catch (error) {
    console.error("Registration Error:", error);
    return { error, success: false };
  }
};

export const verifyEmail = async (token, email) => {
  try {
    const res = await fetch(`${url}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token }),
    });
    const data = await res.json();
    return { data, success: res.ok };
  } catch (error) {
    console.error("Email Verification Error:", error);
    return { error, success: false };
  }
};


export const sendForgotPasswordCode = async (email) => {
  try {
    const res = await fetch(`${url}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    return { data, success: res.ok };
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return { error, success: false };
  }
};

export const verifyForgotPasswordCode = async (email, code) => {
  try {
    const res = await fetch(`${url}/auth/verify-reset-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    return { data, success: res.ok };
  } catch (error) {
    console.error("Verify Reset Code Error:", error);
    return { error, success: false };
  }
};

export const resetPasswordWithCode = async (email, code, newPassword) => {
  try {
    const res = await fetch(`${url}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword }),
    });
    const data = await res.json();
    return { data, success: res.ok };
  } catch (error) {
    console.error("Reset Password Error:", error);
    return { error, success: false };
  }
};
