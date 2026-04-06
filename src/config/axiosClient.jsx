import axios from "axios";
import { cookies } from "next/headers";
import { apiConfig } from "./apiConfig";

const axiosClient = axios.create({
  baseURL: apiConfig.baseUrl,
  responseType: "json",
  // ✅ Yeh zaroori hai taake Axios 403 ko error na banaye aur hum khud handle karein
  validateStatus: () => true,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- 1. REQUEST INTERCEPTOR ---
axiosClient.interceptors.request.use(async function (config) {
  const cookieStore = await cookies();
  const sessionInfo = cookieStore.get("sessionToken");
  if (sessionInfo?.value) {
    config.headers["Authorization"] = `Bearer ${sessionInfo.value}`;
  }
  return config;
});

// --- 2. RESPONSE INTERCEPTOR (Yahan issue tha) ---
axiosClient.interceptors.response.use(
  (response) => {
    // ✅ Check status 403 yahan success block mein karein
    if (response.status === 403) {
      const message = response.data?.message || "";

      // Agar backend se "Inactive" message aaye
      if (message.includes("Inactive")) {
        if (typeof window !== "undefined") {
          // Cookies delete karein
          document.cookie =
            "sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie =
            "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

          // ✅ Redirect to landing/login page
          window.location.href = "/";
        }
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosClient;
