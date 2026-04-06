"use client";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

export const useAuth = () => {
    const [user, setUser] = useState(null);

    const loadUser = () => {
        const storedUser = getCookie("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                setUser(null);
            }
        }
    };

    useEffect(() => {
        loadUser();
        // Har 2 second baad check karein agar role update hua hai (Optional but safe)
        const interval = setInterval(loadUser, 2000);
        return () => clearInterval(interval);
    }, []);

    const role = user?.role || "viewer";

    return {
        user,
        role: role.toLowerCase(),
        isAdmin: role.toLowerCase() === "admin",
        isEditor: role.toLowerCase() === "editor",
        isViewer: role.toLowerCase() === "viewer",
    };
};