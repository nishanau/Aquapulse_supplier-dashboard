import React from "react";
import styles from "./button.module.css";

const Button = ({ background, name, clickHandler }) => {
  const handleClick = () => {
    if (clickHandler) {
      clickHandler();
    }
  };
  return (
    <div>
      <button
        className={styles.button}
        style={{ background: background }}
        onClick={handleClick}
      >
        {name}
      </button>
    </div>
  );
};

export default Button;
