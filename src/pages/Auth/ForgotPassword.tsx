import { authStyles as styles } from "./Auth.styles";
import { images } from "@/assets/images";
import Languages from "./Languages";
import Form from "./Form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import React, { useState } from "react";
import AuthSwitch from "./AuthSwitch";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useForgotPassword } from "@/components/hooks/useForgotPassword";

const version = import.meta.env.VITE_REACT_APP_VERSION;

export default function ForgotPassword() {
  const { sendResetLink, isLoading, error, message, clearError } = useForgotPassword();
  const [email, setEmail] = useState("");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    sendResetLink(email);
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
          title="Forgot Password"
          subTitle={"Enter your email and we'll send you a link to reset your password."}
          onSubmit={handleSubmit}
          footer={<AuthSwitch type="forgot" />}
        >
          <Input type="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          {/* Message popup */}
          {message && <div className={styles.formSuccess}>{message}</div>}
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
            {isLoading ? "Sending" : "Send"}
          </Button>
        </Form>
      </div>
    </div>
  );
}
