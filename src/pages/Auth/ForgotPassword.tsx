import { authStyles as styles } from "./Auth.styles";
import { images } from "@/assets/images";
import Languages from "./Languages";
import Form from "./Form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import { useState } from "react";
import AuthSwitch from "./AuthSwitch";

const version = import.meta.env.VITE_REACT_APP_VERSION;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "") {
      setErrors("Email cannot empty!");
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
          title="Forgot Password"
          subTitle={"Enter your email and we'll send you a link to reset your password."}
          onSubmit={handleSubmit}
          footer={<AuthSwitch type="forgot" />}
        >
          <Input type="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
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
            Send
          </Button>
        </Form>
      </div>
    </div>
  );
}
