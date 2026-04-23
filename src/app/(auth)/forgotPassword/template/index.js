"use client";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import styles from "@/css/Auth.module.css";
import { useSnackbar } from "@/components/Snackbar";
import handleAxiosError from "@/components/HandleAxiosError";

const ForgotPassword = () => {
  const showAlert = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await ForgotPasswordApi();
  };

  const ForgotPasswordApi = async () => {
    try {
      setLoading(true);
      const res = await axios.post("forgotPassword/api", {
        email: formData.email,
      });

      if (res?.status === 200) {
        showAlert({
          message: res?.data?.message || "Reset link sent to your email! 📧",
          type: "success",
        });
        setFormData({ email: "" });
      }
    } catch (error) {
      const { message } = handleAxiosError(error);
      showAlert({
        message: message || "Something went wrong",
        type: "error",
      });
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

            <h2>Forgot Password?</h2>
            <p>
              Enter your email and we will send a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <Button type="submit" loading={loading} disabled={!formData.email}>
              Verify & Send Link
            </Button>
          </form>

          <div className={styles.footerText}>
            <p>
              Remember your password? <Link href="/login">Back to login</Link>
            </p>
            <div style={{ marginTop: "10px" }}>
              <Link
                href="/signup"
                style={{
                  color: "var(--primary-color)",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
