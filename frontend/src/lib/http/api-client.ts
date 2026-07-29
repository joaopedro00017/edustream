import axios, { type AxiosError } from "axios";
import { API_BASE_URL } from "@/lib/config/env";
import { clearSession, getStoredToken } from "@/lib/auth/token-storage";

//Cliente Axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//Token JWT
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

//Autenticação
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isUnauthorized = error.response?.status === 401;
    const isOnAuthPage =
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/auth");

    if (isUnauthorized && !isOnAuthPage) {
      clearSession();
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  },
);
