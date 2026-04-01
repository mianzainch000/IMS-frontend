import React from "react";
import styles from "@/css/Button.module.css";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary", // primary, outline, danger
  fullWidth = true,
  loading = false,
  disabled = false,
}) => {
  const buttonClass = `
        ${styles.btn} 
        ${styles[variant]} 
        ${fullWidth ? styles.fullWidth : ""} 
        ${disabled || loading ? styles.disabled : ""}
    `.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClass}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className={styles.loaderContainer}>
          <div className={styles.spinner}></div>
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
