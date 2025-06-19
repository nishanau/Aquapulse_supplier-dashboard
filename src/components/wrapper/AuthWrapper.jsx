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
          <Image
            src="/logo.png"
            alt="Loading..."
            width={400}
            height={200}
            className={styles.loadingImage}
          />
        </div>
      ) : (
        children
      )}
    </>
  );
}
