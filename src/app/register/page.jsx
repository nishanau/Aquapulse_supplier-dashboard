import React from "react";
import styles from "./register.module.css";
import Button from "@/components/button/Button";
import { colors } from "@/utils/colors";

const Register = () => {
  return (
    <div className={styles.container}>
      <h1>Register</h1>
      <div className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder="Company Name"
        />
        <input className={styles.input} type="email" placeholder="Email" />

        <input
          className={styles.input}
          type="password"
          placeholder="Password"
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Confirm Password"
        />
        <input
          className={styles.input}
          type="number"
          placeholder="Phone Number"
        />
        <br />
        <input
          className={styles.input}
          type="text"
          placeholder="Address Line 1"
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Address Line 2"
        />
        <input className={styles.input} type="text" placeholder="City" />

          <input className={styles.input} type="text" placeholder="State" />
          <input className={styles.input} type="text" placeholder="Post Code" />

      </div>
      <Button background={colors.success} name="Register" />
    </div>
  );
};

export default Register;
