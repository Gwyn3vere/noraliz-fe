import { authStyles as styles } from "./Auth.styles";
import { images } from "@/assets/images";

export default function OAuthSection({ mode }: { mode: "login" | "register" }) {
  return (
    <div className="flex flex-col items-center gap-[22px] mb-[22px]">
      <div className="flex items-center gap-2">
        <div className="w-[45px] h-[1px] bg-[var(--color-dark)]" />
        <span className="text-[14px] font-semibold">or</span>
        <div className="w-[45px] h-[1px] bg-[var(--color-dark)]" />
      </div>

      <div className={styles.googleButton}>
        <img src={images.goggleIcon} className={styles.googleIcon} />
        <span className={styles.googleTextStyle}>{mode === "login" ? "Sign in" : "Sign up"} with Google</span>
      </div>
    </div>
  );
}
