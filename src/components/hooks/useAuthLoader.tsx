import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { refreshTokenApi } from "@/services/authApi";
import { useAuthStore } from "@/stores/authStore";

const AUTH_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"];

export function useAuthLoader() {
  const { setAuth, isAuthenticated } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Nếu đang ở trang auth, không cần kiểm tra
    if (isAuthenticated || AUTH_PATHS.includes(location.pathname)) {
      setIsReady(true);
      return;
    }

    const initAuth = async () => {
      try {
        const data = await refreshTokenApi();
        if (data?.accessToken) {
          setAuth(data?.user, data?.accessToken);
        }
      } catch {
        // Lỗi 401 được bỏ qua – interceptor đã xử lý
      } finally {
        setIsReady(true);
      }
    };

    initAuth();
  }, []);

  return isReady;
}
