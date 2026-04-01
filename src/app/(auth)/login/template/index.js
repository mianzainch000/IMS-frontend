"use client";
import Link from "next/link";
import { useState } from "react";
import Input from "@/components/Input";
import { signIn } from "next-auth/react";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import styles from "@/css/Auth.module.css";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/components/Snackbar";
import handleAxiosError from "@/components/HandleAxiosError";

export default function LoginPage() {
  const router = useRouter();
  const showAlert = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // SVG Icons
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
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false, // Taake hum khud alert dikha saken
      });

      if (res?.ok) {
        showAlert({ message: "✅ Login successful", type: "success" });
        setFormData({ email: "", password: "" });
        router.push("/home"); // Redirect to dashboard/home
      } else {
        showAlert({
          message: `❌ ${res?.error || "Invalid credentials"}`,
          type: "error",
        });
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

            <h2>Welcome Back</h2>
            <p>Enter your details to access your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <div className={styles.passwordWrapper}>
              <Input
                label="Password"
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />
              <button
                type="button"
                className={styles.eyeIcon}
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOpen /> : <EyeClosed />}
              </button>
            </div>

            <div style={{ textAlign: "right", marginBottom: "15px" }}>
              <Link
                href="/forgotPassword"
                style={{
                  fontSize: "12px",
                  color: "var(--primary-color)",
                  textDecoration: "none",
                }}
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={!formData.email || !formData.password}
            >
              Sign In
            </Button>
          </form>

          <p className={styles.footerText}>
            Do not have an account? <Link href="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
