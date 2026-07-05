import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5193/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // vẫn gửi cookie nếu có (tương thích ngược)
});

// Request interceptor: gắn access token và refresh token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const refreshToken = useAuthStore.getState().refreshToken;
  if (refreshToken) {
    config.headers["X-Refresh-Token"] = refreshToken;
  }
  return config;
});

// Hàng đợi refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        const res = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          {
            headers: { "X-Refresh-Token": refreshToken },
            withCredentials: true,
          },
        );
        const newToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore.getState().setAuth(currentUser, newToken, newRefreshToken);
        }
        processQueue(null, newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        const currentPath = window.location.pathname;
        const authPaths = ["/", "/login", "/register", "/forgot-password", "/reset-password"];
        if (!authPaths.includes(currentPath)) {
          useAuthStore.getState().clearAuth();
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

// Khởi tạo auth khi app load
export async function initializeAuth() {
  const store = useAuthStore.getState();
  if (!store.accessToken && store.refreshToken) {
    try {
      const res = await axios.post(
        `${api.defaults.baseURL}/auth/refresh`,
        {},
        {
          headers: { "X-Refresh-Token": store.refreshToken },
          withCredentials: true,
        },
      );
      const { accessToken, refreshToken, user } = res.data;
      if (user) {
        useAuthStore.getState().setAuth(user, accessToken, refreshToken);
      }
    } catch {
      useAuthStore.getState().clearAuth();
    }
  }
}

export default api;
