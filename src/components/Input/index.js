import React from "react";
import styles from "@/css/Input.module.css";

const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  error,
  required = false,
}) => {
  return (
    <div className={styles.inputGroup}>
      {label && (
        <label className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.inputField} ${error ? styles.inputError : ""}`}
        required={required}
      />

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default Input;
