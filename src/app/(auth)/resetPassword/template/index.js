"use client";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import styles from "@/css/Auth.module.css";
import { apiConfig } from "@/config/apiConfig";
import { useSnackbar } from "@/components/Snackbar";
import { useSearchParams, useRouter } from "next/navigation";
import handleAxiosError from "@/components/HandleAxiosError";

const ResetPassword = () => {
  const showAlert = useSnackbar();
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams?.get("token") || "";

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const EyeOpen = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
  const EyeClosed = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!token) {
      showAlert({ message: "❌ Invalid or expired token", type: "error" });
      return;
    }

    await ResetPasswordApi();
  };

  const ResetPasswordApi = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${apiConfig.baseUrl}${apiConfig.resetPassword}/${token}`,
        {
          newPassword: formData.password,
          token: token,
        },
      );

      if (res?.status === 200) {
        showAlert({
          message: res?.data?.message || "Password reset successful! 🎉",
          type: "success",
        });
        setFormData({ password: "", confirmPassword: "" });

        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (error) {
      const { message } = handleAxiosError(error);
      showAlert({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo}>IMS</div>

            <h1 className={styles.title}>Security First!</h1>
            <p className={styles.subText}>
              Create a strong new password to protect your account.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.passwordWrapper}>
              <Input
                label="New Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                error={errors.password}
                required
              />
              <button
                type="button"
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOpen /> : <EyeClosed />}
              </button>
            </div>

            <div className={styles.passwordWrapper}>
              <Input
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your new password"
                error={errors.confirmPassword}
                required
              />
              <button
                type="button"
                className={styles.eyeIcon}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOpen /> : <EyeClosed />}
              </button>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={!formData.password || !formData.confirmPassword}
            >
              Reset Password
            </Button>
          </form>

          <div className={styles.footerText}>
            <Link
              href="/"
              style={{
                color: "var(--primary-color)",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
