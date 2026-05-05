import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordApi } from "@/services/authApi";

interface UseForgotPasswordReturn {
  sendResetLink: (email: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  message: string | null;
  clearError: () => void;
}

export function useForgotPassword(): UseForgotPasswordReturn {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const sendResetLink = async (email: string) => {
    setError(null);
    setMessage(null);

    if (!email) {
      setError("Email is required.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await forgotPasswordApi(email);

      setMessage(data.message || "If this email exists, a reset link has been sent.");

      if (data.resetToken) {
        setTimeout(() => {
          navigate(`/reset-password?token=${data.resetToken}`, { replace: true });
        }, 2000);
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.errorMessage || "Failed to send reset link. Please try again.");
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

  return { sendResetLink, isLoading, error, message, clearError };
}
