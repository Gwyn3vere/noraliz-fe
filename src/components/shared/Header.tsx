import React, { useState, useEffect, useRef } from "react";
import { sharedStyles as styles } from "./Shared.styles";
import { ChevronDown, Bell } from "lucide-react";
import { images } from "@/assets/images";
import classnames from "classnames/bind";
import { useCurrentUser } from "@/components/hooks/useCurrentUser";

const cx = classnames.bind(styles);

const DROPDOWN = {
  USER: "user",
  NOTI: "noti",
  SETTINGS: "settings",
} as const;

type DropdownType = (typeof DROPDOWN)[keyof typeof DROPDOWN] | null;

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleDropdown = (type: DropdownType) => {
    setOpenDropdown((prev) => (prev === type ? null : type));
  };

  return (
    <header className={styles.headerContainer}>
      {/* Logo */}
      <div className="flex items-center gap-[10px]">
        <div className={styles.logo} />
        <span className={styles.brand}>NORALIZ</span>
      </div>

      <div ref={containerRef} className="flex items-center gap-[30px]">
        {/* Notification */}
        <div
          className="relative h-[40px] flex items-center cursor-pointer select-none"
          onClick={() => handleToggleDropdown("noti")}
        >
          <div className={styles.notification}>
            <span className="text-[10px] font-bold text-white leading-none">2</span>
          </div>
          <Bell size={24} />
          <NotificateDropdown isOpen={openDropdown === "noti"} />
        </div>
        {/* User menu dropdown */}
        <div className={styles.userDropdown} onClick={() => handleToggleDropdown("user")}>
          <div className={styles.avatar}>
            <img src={images.avatar} alt="avatar" />
          </div>
          <div className="hidden md:flex flex-col justify-center select-none">
            <span className="text-[15px] font-bold leading-none">{isLoading ? "..." : user?.fullName || "User"}</span>
            <p className="text-[12px]">{isLoading ? "..." : user?.email || "email@example.com"}</p>
          </div>
          <ChevronDown
            size={15}
            strokeWidth={3}
            className={cx(openDropdown === "user" ? "rotate-180 transition-all" : "transition-all", "hidden md:block")}
          />
          <UserMenuDropdown isOpen={openDropdown === "user"} />
        </div>
      </div>
    </header>
  );
}

type Props = {
  isOpen: boolean;
};

const NotificateDropdown = React.memo(({ isOpen }: Props) => {
  return <div className={cx(isOpen ? "block" : "hidden", styles.menuDropdown)}>Notification</div>;
});

const UserMenuDropdown = React.memo(({ isOpen }: Props) => {
  return <div className={cx(isOpen ? "block" : "hidden", styles.menuDropdown)}>User Menu</div>;
});
