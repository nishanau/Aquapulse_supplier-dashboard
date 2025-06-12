import React from "react";
import styles from "./button.module.css";

const Button = ({ background, name, icon }) => {
  return (
    <div>
      <button className={styles.button} style={{ background: background }}>
        {name}

      </button>
    </div>
  );
};

export default Button;
