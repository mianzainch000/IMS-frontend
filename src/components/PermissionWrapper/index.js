"use client";
import { useAuth } from "@/hooks/useAuth";

const PermissionWrapper = ({ children, allowedRoles }) => {
    const { role, user } = useAuth();

    // Agar user logged in nahi hai, toh kuch nahi dikhana
    if (!user) return null;

    // Strict check: Role ko lowercase aur trim karke match karein
    const isAllowed = allowedRoles.some(
        (r) => r.toLowerCase().trim() === role.toLowerCase().trim()
    );

    // Agar allowed hai toh children (buttons) dikhayen, warna null
    return isAllowed ? <>{children}</> : null;
};

export default PermissionWrapper;