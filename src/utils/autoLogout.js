import { deleteCookie } from "cookies-next";

export const handleGlobalLogout = () => {
  deleteCookie("sessionToken", { path: "/" });
  deleteCookie("user", { path: "/" });

  document.cookie =
    "sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  window.location.href = "/";
};
