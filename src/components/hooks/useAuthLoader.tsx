import { useEffect, useState } from "react";
import { refreshTokenApi } from "@/services/authApi";
import { useAuthStore } from "@/stores/authStore";

export function useAuthLoader() {
  const { setAuth, isAuthenticated } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Nếu đã xác thực rồi thì không cần làm gì nữa.
    if (isAuthenticated) {
      setIsReady(true);
      return;
    }

    const initAuth = async () => {
      try {
        const data = await refreshTokenApi();
        if (data?.accessToken) {
          setAuth(data?.user, data?.accessToken, data?.refreshToken);
        }
      } catch {
        // Không cần làm gì, interceptor trong api.ts đã xử lý lỗi
      } finally {
        setIsReady(true);
      }
    };

    initAuth();
  }, []); // Chỉ chạy một lần duy nhất khi app khởi động

  return isReady;
}
