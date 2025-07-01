"use client";
import React, { useState, useEffect } from "react";
import styles from "../register.module.css";
import { colors } from "@/utils/colors";

const Step2AccountSecurity = ({ formData, setFormData, errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Calculate password strength
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    // Length check
    if (formData.password.length >= 8) strength += 1;
    // Contains uppercase
    if (/[A-Z]/.test(formData.password)) strength += 1;
    // Contains lowercase
    if (/[a-z]/.test(formData.password)) strength += 1;
    // Contains number
    if (/[0-9]/.test(formData.password)) strength += 1;
    // Contains special character
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;

    setPasswordStrength(strength);
  }, [formData.password]);

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 4) return "Moderate";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 2) return colors.danger;
    if (passwordStrength <= 4) return colors.warning;
    return colors.success;
  };

  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Account Security</h2>

      <div className={styles.formGroup}>
        <label htmlFor="password">Password*</label>
        <div className={styles.passwordInputContainer}>
          <input
            id="password"
            className={`${styles.input} ${
              errors.password ? styles.inputError : ""
            }`}
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password || ""}
            onChange={handleChange}
            placeholder="Create a strong password"
          />
          <button
            type="button"
            className={styles.showPasswordButton}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        {errors.password && (
          <span className={styles.errorText}>{errors.password}</span>
        )}

        {formData.password && (
          <div className={styles.passwordStrength}>
            <div className={styles.strengthMeter}>
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={styles.strengthBar}
                  style={{
                    backgroundColor:
                      level <= passwordStrength
                        ? getStrengthColor()
                        : "#e0e0e0",
                    width: `${100 / 5}%`,
                  }}
                ></div>
              ))}
            </div>
            <span style={{ color: getStrengthColor() }}>
              {getStrengthLabel()}
            </span>
          </div>
        )}

        <ul className={styles.passwordRequirements}>
          <li
            className={
              formData.password?.length >= 8 ? styles.validRequirement : ""
            }
          >
            At least 8 characters
          </li>
          <li
            className={
              /[A-Z]/.test(formData.password || "")
                ? styles.validRequirement
                : ""
            }
          >
            At least one uppercase letter
          </li>
          <li
            className={
              /[a-z]/.test(formData.password || "")
                ? styles.validRequirement
                : ""
            }
          >
            At least one lowercase letter
          </li>
          <li
            className={
              /[0-9]/.test(formData.password || "")
                ? styles.validRequirement
                : ""
            }
          >
            At least one number
          </li>
          <li
            className={
              /[^A-Za-z0-9]/.test(formData.password || "")
                ? styles.validRequirement
                : ""
            }
          >
            At least one special character
          </li>
        </ul>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">Confirm Password*</label>
        <div className={styles.passwordInputContainer}>
          <input
            id="confirmPassword"
            className={`${styles.input} ${
              errors.confirmPassword ? styles.inputError : ""
            }`}
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword || ""}
            onChange={handleChange}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            className={styles.showPasswordButton}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        {errors.confirmPassword && (
          <span className={styles.errorText}>{errors.confirmPassword}</span>
        )}
      </div>

      <p className={styles.requiredNote}>* Required fields</p>
    </div>
  );
};

export default Step2AccountSecurity;
