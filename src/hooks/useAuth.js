"use client";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

export const useAuth = () => {
    // 1. Lazy Initialization: State bante waqt hi cookie check karein
    const [user, setUser] = useState(() => {
        const storedUser = getCookie("user");
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch (error) {
                return null;
            }
        }
        return null;
    });

    useEffect(() => {
        const loadUser = () => {
            const storedUser = getCookie("user");
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    // Sirf tab update karein agar data waqai badla ho
                    // Isse cascading renders ruk jayenge
                    setUser((prev) => {
                        if (JSON.stringify(prev) !== storedUser) {
                            return parsedUser;
                        }
                        return prev;
                    });
                } catch (error) {
                    setUser(null);
                }
            }
        };

        // Ab yahan loadUser() ko foran call karne ki zaroorat nahi
        // Kyunke useState ne pehli baar data utha liya hai.

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