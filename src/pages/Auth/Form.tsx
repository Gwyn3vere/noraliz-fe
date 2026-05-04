import { Link } from "react-router-dom";
import { authStyles as styles } from "./Auth.styles";
import { LinkedinLogoIcon, FacebookLogoIcon, MessengerLogoIcon, InstagramLogoIcon } from "@phosphor-icons/react";

type FormProps = {
  title: string;
  subTitle?: React.ReactNode;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

  footer?: React.ReactNode; // 👈 custom phần dưới
  oauth?: React.ReactNode; // 👈 custom OAuth
};

function Form({ title, subTitle, children, onSubmit, footer, oauth }: FormProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100%-90px)]">
      {/* Header */}
      <div className="flex flex-col items-center leading-[1.2]">
        <span className="text-[40px] font-black italic text-[var(--color-primary)]">{title}</span>
        {subTitle && <div className="text-[14px] text-center max-w-[235px]">{subTitle}</div>}
      </div>
      {/* Form */}
      <form id="form" className={styles.formComp} onSubmit={onSubmit}>
        {children}
      </form>
      {/* OAuth2 */}
      {oauth}

      {footer}

      {/* Social */}
      <div className="flex items-center gap-[15px] mt-[37px]">
        <Link to="#">
          <LinkedinLogoIcon size={25} weight="fill" />
        </Link>
        <Link to="#">
          <FacebookLogoIcon size={25} weight="fill" />
        </Link>
        <Link to="#">
          <MessengerLogoIcon size={25} weight="fill" />
        </Link>
        <Link to="#">
          <InstagramLogoIcon size={25} weight="fill" />
        </Link>
      </div>
    </div>
  );
}

export default Form;
