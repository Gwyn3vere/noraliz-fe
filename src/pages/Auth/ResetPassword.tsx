import { authStyles as styles } from "./Auth.styles";
import { images } from "@/assets/images";
import Languages from "./Languages";
import Form from "./Form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import { useState } from "react";
import { EyeSlashIcon, EyeIcon } from "@phosphor-icons/react";
import { useSearchParams } from "react-router-dom";
import BadRequest from "@/pages/Errors/BadRequest";

const version = import.meta.env.VITE_REACT_APP_VERSION;

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return <BadRequest />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === "" || passwordConfirm === "") {
      setErrors("Password cannot empty!");
    } else {
      console.log("post data success");
    }

    return;
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
          <div className="relative">
            <Input
              type={isShowPassword ? "text" : "password"}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Password confirm"
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
          {errors !== "" && (
            <div className={styles.formErrors}>
              <Button type="button" className="w-auto h-auto !p-0 cursor-pointer" onClick={() => setErrors("")}>
                <CircleX size={17} strokeWidth={3} />
              </Button>{" "}
              {errors}
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
