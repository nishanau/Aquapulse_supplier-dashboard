import React from "react";
import styles from "./toast.module.css";

const Toast = ({ message, type }) => {
  return <div className={`${styles.container} ${styles[type]}`}>{message}</div>;
};

export default Toast;
