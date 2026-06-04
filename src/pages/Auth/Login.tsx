import { authStyles as styles } from "./Auth.styles";
import { images } from "@/assets/images";
import Languages from "./Languages";
import Form from "./Form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EyeSlashIcon, EyeIcon } from "@phosphor-icons/react";
import { CircleX } from "lucide-react";
import React, { useState } from "react";
import OAuthSection from "./OAuthSection";
import AuthSwitch from "./AuthSwitch";
import { useLogin } from "@/components/hooks/useLogin";
import { useAuthStore } from "@/stores/authStore";

const version = import.meta.env.VITE_REACT_APP_VERSION;

export default function Login() {
  const { login, isLoading, error, clearError } = useLogin();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("Strong@123");
  const [isShowPassword, setIsShowPassword] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return;
    login(email, password);
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
          title="Hi Creator"
          subTitle={
            <span className="text-[14px]">
              Welcome to <span className="font-display font-bold text-[14px] uppercase">Noraliz</span>
            </span>
          }
          onSubmit={handleSubmit}
          oauth={<OAuthSection mode="login" />}
          footer={<AuthSwitch type="login" />}
        >
          <Input type="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <div className="relative">
            <Input
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <Button
              type="button"
              className="absolute top-1/2 translate-y-[-50%] right-0"
              onClick={() => setIsShowPassword((prev) => !prev)}
            >
              {!isShowPassword ? <EyeSlashIcon size={17} weight="bold" /> : <EyeIcon size={17} weight="bold" />}
            </Button>
          </div>
          {/* Errors popup */}
          {error && (
            <div className={styles.formErrors}>
              <Button type="button" className="w-auto h-auto !p-0 cursor-pointer" onClick={clearError}>
                <CircleX size={17} strokeWidth={3} />
              </Button>{" "}
              {error}
            </div>
          )}
          <div className="flex items-center justify-between text-[12px] w-[300px]">
            {/* Remember checkbox */}
            <div className="flex items-center gap-[3px]">
              <Checkbox />
              <span className="">Remember me?</span>
            </div>
            {/* Forgot pw */}
            <Link to="/forgot-password" className="text-[var(--color-primary)]">
              Forgot password
            </Link>
          </div>
          <Button form="form" type="submit" className={styles.formBtn}>
            {isLoading ? "Authenticating" : "Sign In"}
          </Button>
        </Form>
      </div>
    </div>
  );
}
