"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useAuth } from "@/hooks/useAuth";
import styles from "./wrapper.module.css";
import Image from "next/image";

export default function AuthWrapper({ children }) {
  useAuth(); // Initialize auth
  const { isLoading } = useAuthStore();

  return (
    <>
      {isLoading ? (
        <div className={styles.container}>
          <div className={styles.loadingImage}>
            <Image
              src="/logo.png"
              alt="Loading..."
              width={120}
              height={60}
              priority
            />
          </div>
          <div className={styles.loadingText}>Almost there...</div>
        </div>
      ) : (
        children
      )}
    </>
  );
}