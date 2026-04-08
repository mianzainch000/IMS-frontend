"use client";
import { useAuth } from "@/hooks/useAuth";

const PermissionWrapper = ({ children, allowedRoles }) => {
  const { role, user } = useAuth();

  if (!user) return null;

  const isAllowed = allowedRoles.some(
    (r) => r.toLowerCase().trim() === role.toLowerCase().trim(),
  );

  return isAllowed ? <>{children}</> : null;
};

export default PermissionWrapper;
