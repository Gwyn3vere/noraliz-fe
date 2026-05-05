import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPasswordApi } from "@/services/authApi";

interface UseResetPasswordReturn {
  resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  message: string | null;
  clearError: () => void;
}

export function useResetPassword(): UseResetPasswordReturn {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const resetPassword = async (token: string, newPassword: string, confirmPassword: string) => {
    setError(null);
    setMessage(null);

    if (!newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await resetPasswordApi(token, newPassword);
      setMessage(data.message || "Password has been reset successfully.");
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.errorMessage || "Failed to reset password. The link may be invalid or expired.");
      } else if (err.request) {
        setError("Cannot connect to server. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
    setMessage(null);
  };

  return { resetPassword, isLoading, error, message, clearError };
}
