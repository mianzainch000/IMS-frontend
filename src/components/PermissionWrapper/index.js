"use client";
import { useAuth } from "@/hooks/useAuth";

const PermissionWrapper = ({ children, allowedRoles }) => {
    const { role } = useAuth(); // Yahan se role aa raha hai

    // --- DEBUGGING LOGS ---
    console.log("----------------------------------");
    console.log("Logged-in Role:", `"${role}"`);
    console.log("Allowed Roles for this component:", allowedRoles);

    // Strict comparison
    const isAllowed = allowedRoles.some(
        (r) => r.toLowerCase().trim() === role.toLowerCase().trim()
    );

    console.log("Result (Is Allowed?):", isAllowed);
    console.log("----------------------------------");
    // ----------------------

    if (isAllowed) {
        return <>{children}</>;
    }

    return null;
};

export default PermissionWrapper;