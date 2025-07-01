"use client";
import React from "react";
import styles from "./login.module.css";
import Link from "next/link";
import Button from "@/components/button/Button";
import { colors } from "@/utils/colors";
import { handleLogin } from "@/utils/apiService";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/provider/ToastProvider";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const router = useRouter();
  const setIsAuthenticated = useAuthStore((s) => s.setIsAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const { showToast } = useToast();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleLoginClick = async () => {
    if (!email || !password || !email.includes("@") || password.length < 6) {
      if (!email || !email.includes("@")) {
        setEmailError(true);
      }
      if (!password || password.length < 6) {
        setPasswordError(true);
      }
      return;
    }
    const loginSuccess = await handleLogin(email, password);

    if (loginSuccess && loginSuccess.success) {
      setIsAuthenticated(true);
      setUser(loginSuccess.data.user);
      showToast("Login successful", "success");
      router.push(callbackUrl);
    } else {
      showToast("Login failed. Please check your credentials.", "error");
      setEmailError(true);
      setPasswordError(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign in to AquaPulse</h1>
        <p className={styles.subtitle}>Welcome back! Please login to your account.</p>
        <div className={styles.form}>
          <input
            className={`${styles.input} ${emailError ? styles.emailError : ""}`}
            type="email"
            placeholder="Email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onAnimationEnd={() => setEmailError(false)}
          />
          <input
            className={`${styles.input} ${passwordError ? styles.passwordError : ""}`}
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onAnimationEnd={() => setPasswordError(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLoginClick();
              }
            }}
          />

          <div className={styles.forgotRow}>
            <Link className={styles.forgotLink} href="/forgot-password">
              Forgot password?
            </Link>
          </div>

          <Button
            background={colors}
            name="Login"
            clickHandler={handleLoginClick}
          />
        </div>
        <div className={styles.register}>
          <span>Don't have an account? </span>
          <Link className={styles.registerLink} href="/register">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;