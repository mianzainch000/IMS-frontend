"use client";
import { useState, useEffect } from "react";
import NextTopLoader from "nextjs-toploader";
import { SnackbarProvider } from "@/components/Snackbar";
export default function Provider({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);
  if (!mounted) return null;
  return (
    <SnackbarProvider>
      <NextTopLoader showSpinner={false} color="#3b82f6" />
      {children}
    </SnackbarProvider>
  );
}
