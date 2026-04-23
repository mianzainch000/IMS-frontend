import axios from "axios";
import { cookies } from "next/headers";
import { apiConfig } from "./apiConfig";

const axiosClient = axios.create({
  baseURL: apiConfig.baseUrl,
  responseType: "json",

  validateStatus: () => true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(async function (config) {
  const cookieStore = await cookies();
  const sessionInfo = cookieStore.get("sessionToken");
  if (sessionInfo?.value) {
    config.headers["Authorization"] = `Bearer ${sessionInfo.value}`;
  }
  return config;
});

export default axiosClient;
