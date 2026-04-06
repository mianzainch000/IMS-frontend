import { deleteCookie } from "cookies-next";

/**
 * Global Logout Function
 * Clears cookies and redirects to login page.
 */
export const handleGlobalLogout = () => {
    // 1. Cookies clear karein (Jo role aur session ke liye hain)
    deleteCookie("sessionToken", { path: "/" });
    deleteCookie("user", { path: "/" });

    // 2. Browser ki default cookie storage se bhi clear karein (Safety check)
    document.cookie = "sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // 3. Page ko login par bhej dein aur reload karein taake state fresh ho jaye
    window.location.href = "/";
};