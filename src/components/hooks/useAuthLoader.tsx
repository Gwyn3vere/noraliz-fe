import { useEffect, useState } from "react";
import { refreshTokenApi } from "@/services/authApi";
import { useAuthStore } from "@/stores/authStore";
// import { getCookie } from "@/utils/cookie";

export function useAuthLoader() {
  const { setAuth, clearAuth, isAuthenticated } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setIsReady(true);
      return;
    }

    // const hasRefreshToken = getCookie("refreshToken");
    // if (!hasRefreshToken) {
    //   setIsReady(true);
    //   return;
    // }

    const initAuth = async () => {
      try {
        const data = await refreshTokenApi();
        if (data.accessToken) {
          setAuth(data.user || { id: "", email: "", fullName: "" }, data.accessToken);
        }
      } catch (error: any) {
        if (error.response?.status !== 401) {
          clearAuth();
        }
      } finally {
        setIsReady(true);
      }
    };

    initAuth();
  }, []);

  return isReady;
}
