import { authStyles as styles } from "./Auth.styles";
import { images } from "@/assets/images";
import Languages from "./Languages";
import Form from "./Form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleX, CheckCircle } from "lucide-react";
import React, { useState } from "react";
import { EyeSlashIcon, EyeIcon } from "@phosphor-icons/react";
import { useSearchParams, Navigate } from "react-router-dom";
import BadRequest from "@/pages/Errors/BadRequest";
import { useAuthStore } from "@/stores/authStore";
import { useResetPassword } from "@/components/hooks/useResetPassword";

const version = import.meta.env.VITE_REACT_APP_VERSION;

export default function ResetPassword() {
  const { resetPassword, isLoading, error, message, clearError } = useResetPassword();

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [isShowPassword, setIsShowPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!token) {
    return <BadRequest />;
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return <BadRequest />;
    resetPassword(token, newPassword, newPasswordConfirm);
  };

  return (
    <div className={styles.container}>
      {/* Typography image with version info */}
      <div className={styles.shape} style={{ backgroundImage: `url("${images.typography}")` }}>
        <div className={styles.version}>
          <span>NORALIZ · EST.</span> <span>|</span> <span>© 2026</span> <span>|</span> <span>{version}</span>
        </div>
      </div>

      {/* Login form */}
      <div className={styles.form}>
        <Languages />
        <Form
          title="Reset Password"
          subTitle={"Enter your new password and confirm your password change"}
          onSubmit={handleSubmit}
        >
          <div className="relative">
            <Input
              type={isShowPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Password"
              disabled={isLoading}
            />
            <Button
              type="button"
              className="absolute top-1/2 translate-y-[-50%] right-0"
              onClick={() => setIsShowPassword((prev) => !prev)}
            >
              {!isShowPassword ? <EyeSlashIcon size={17} weight="bold" /> : <EyeIcon size={17} weight="bold" />}
            </Button>
          </div>
          <div className="relative">
            <Input
              type={isShowPassword ? "text" : "password"}
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              placeholder="Password confirm"
              disabled={isLoading}
            />
            <Button
              type="button"
              className="absolute top-1/2 translate-y-[-50%] right-0"
              onClick={() => setIsShowPassword((prev) => !prev)}
            >
              {!isShowPassword ? <EyeSlashIcon size={17} weight="bold" /> : <EyeIcon size={17} weight="bold" />}
            </Button>
          </div>
          {/* Success message */}
          {message && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle size={17} />
              {message}
            </div>
          )}
          {/* Errors popup */}
          {error && (
            <div className={styles.formErrors}>
              <Button type="button" className="w-auto h-auto !p-0 cursor-pointer" onClick={clearError}>
                <CircleX size={17} strokeWidth={3} />
              </Button>{" "}
              {error}
            </div>
          )}
          <Button form="form" type="submit" className={styles.formBtn}>
            Reset
          </Button>
        </Form>
      </div>
    </div>
  );
}
