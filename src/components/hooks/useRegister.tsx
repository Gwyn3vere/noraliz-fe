import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "@/services/authApi";
import { useAuthStore } from "@/stores/authStore";

interface UseRegisterReturn {
  register: (email: string, password: string, fullName: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useRegister(): UseRegisterReturn {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (email: string, password: string, fullName: string) => {
    setError(null);

    if (!email || !password || !fullName) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await registerApi(email, password, fullName);

      if (data.accessToken && data.user) {
        setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
        navigate("/dashboard", { replace: true });
      } else if (data.success === false) {
        setError(data.errorMessage || "Registration failed.");
      } else {
        // Trường hợp register không trả về token (cần verify email)
        navigate("/login", { replace: true });
      }
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 400) {
          setError(err.response.data?.errorMessage || "Invalid input. Please check your information.");
        } else if (err.response.status === 429) {
          setError("Too many registration attempts. Please try again later.");
        } else {
          setError(err.response.data?.errorMessage || "Registration failed. Please try again.");
        }
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

  return { register, isLoading, error, clearError };
}
