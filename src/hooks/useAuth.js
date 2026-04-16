"use client";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";

export const useAuth = () => {
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
