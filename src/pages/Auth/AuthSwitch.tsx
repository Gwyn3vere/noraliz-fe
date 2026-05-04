import { authStyles as styles } from "./Auth.styles";
import { Link } from "react-router-dom";

type AuthType = "login" | "register" | "forgot";

const authSwitchConfig: Record<AuthType, { text: string; linkText: string; to: string }> = {
  login: {
    text: "Don't have an account?",
    linkText: "Sign Up",
    to: "/register",
  },
  register: {
    text: "Have an account?",
    linkText: "Sign In",
    to: "/login",
  },
  forgot: {
    text: "Back to",
    linkText: "Sign In",
    to: "/login",
  },
};

export default function AuthSwitch({ type }: { type: AuthType }) {
  const config = authSwitchConfig[type];

  return (
    <div className={styles.question}>
      <p>{config.text}</p>

      <Link to={type === "login" ? "/register" : "/login"} className="text-[var(--color-primary)]">
        {config.linkText}
      </Link>
    </div>
  );
}
