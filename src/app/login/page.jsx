import React from "react";
import styles from "./login.module.css";
import Link from "next/link";
import Button from "@/components/button/Button";
import { colors } from "@/utils/colors";

const Login = () => {
  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <div className={styles.form}>
        <input className={styles.input} type="text" placeholder="Email" />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
        />
        <Button background={colors} name="Login" />
      </div>
      <div className={styles.register}>
        <span>Don't have an account?  </span>

          <Link className={styles.registerLink}  href="/register">
            Register
          </Link>
      </div>
    </div>
  );
};

export default Login;
