import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginApi } from "@/services/authApi";
import { useAuthStore } from "@/stores/authStore";

interface UseLoginReturn {
  login: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useLogin(): UseLoginReturn {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const data = await loginApi(email, password);

      if (data.accessToken && data.user) {
        setAuth(data.user, data.accessToken);

        const redirectTo = searchParams.get("redirect") || "/dashboard";
        navigate(redirectTo, { replace: true });
      } else {
        setError("Unexpected response from server. Please try again.");
      }
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 401) setError("Invalid email or password.");
        else if (err.response.status === 429) setError("Too many login attempts. Please try again later.");
        else setError(err.response.data?.errorMessage || "Login failed. Please try again.");
      } else if (err.request) {
        setError("Cannot connect to server. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { login, isLoading, error, clearError };
}
