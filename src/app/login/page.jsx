"use client";
import React from "react";
import styles from "./login.module.css";
import Link from "next/link";
import Button from "@/components/button/Button";
import { colors } from "@/utils/colors";
import { handleLogin } from "@/utils/apiService";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const router = useRouter();

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
    
    if (loginSuccess) {
      console.log("Login Success:", loginSuccess);
      // Redirect to home page or dashboard after successful login
      router.push("/dashboard");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <div className={styles.form}>
        <input
          className={`${styles.input} ${emailError ? styles.emailError : ""}`}
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          onAnimationEnd={() => setEmailError(false)}
        />
        <input
          className={`${styles.input} ${
            passwordError ? styles.passwordError : ""
          }`}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          onAnimationEnd={() => setPasswordError(false)}
        />

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
  );
};

export default Login;
