import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { landingStyles as styles } from "./Landing.styles";
import { useState, useRef, useEffect } from "react";
import { NAV_MENU_LDP } from "@/constants/tabMenu";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/components/hooks/useCurrentUser";
import { useAuthStore } from "@/stores/authStore";

function Navbar({ auth }: { auth: boolean }) {
  const [toggleNav, setToggleNav] = useState(false);
  const [onDropdown, setOnDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { user, isLoading } = useCurrentUser();
  const logout = useAuthStore((state) => state.logout);

  const handleToggle = () => {
    setToggleNav((prev) => !prev);
  };
  const handleDropdown = () => {
    setOnDropdown((prev) => !prev);
  };
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOnDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <div className="h-16 bg-transparent" />;
  }

  return (
    <section className={cn("fixed inset-0 z-50 h-[60px] ", "bg-[var(--color-body-light)]")}>
      <div className={cn("max-w-[1420px] h-full px-2.5 md:mx-auto", "flex items-center lg:grid grid-cols-3")}>
        {/* Logo, brand name */}
        <div className={cn("order-2 lg:order-1", "flex items-center gap-2.5")}>
          <div
            className={cn("w-[40px] h-[40px]", "rounded-[10px] bg-[var(--color-primary)]", "border border-transparent")}
          />
          <span className={cn("font-display uppercase", "text-[20px] font-black")}>Noraliz</span>
        </div>

        {/* Navbar */}
        <div className={cn("order-1 lg:order-2")}>
          <Button onClick={handleToggle} className={cn("block lg:hidden", styles.navButton)}>
            <ListIcon size={32} />
          </Button>

          <nav
            className={cn(
              "fixed inset-0 z-50",
              "w-full h-screen p-2.5",
              "bg-[var(--color-light)]",
              "transition-transform duration-300",
              toggleNav ? "translate-x-0" : "-translate-x-full",

              "lg:static lg:w-auto lg:h-auto",
              "lg:translate-x-0",
              "lg:bg-transparent",
              "lg:p-0",
            )}
          >
            <div className={cn("flex items-center justify-between")}>
              <span className="text-[20px] font-bold static lg:hidden">Menu</span>
              <Button onClick={handleToggle} className={cn("block lg:hidden !mr-0", styles.navButton)}>
                <XIcon size={32} />
              </Button>
            </div>

            <div className={cn("mt-5 lg:mt-0 flex flex-col lg:flex-row gap-2 lg:gap-[20px]")}>
              {NAV_MENU_LDP.map((nav) => (
                <Link to={nav.sectionId} key={nav.id} onClick={(e) => handleNavClick(e, nav.sectionId)}>
                  <div className={cn(styles.navMenu)}>{nav.title}</div>
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* Button */}
        {!auth ? (
          <Link to="/login" className={cn("order-3 ml-auto")}>
            <div
              className={cn(
                "flex items-center justify-center",
                "!w-[100px] !rounded-full !mr-0 !font-bold",
                styles.navButton,
              )}
            >
              Sign In
            </div>
          </Link>
        ) : (
          <div ref={dropdownRef} className="relative order-3 ml-auto ">
            <Button onClick={handleDropdown} className={cn("!rounded-full", "uppercase !font-bold", styles.navButton)}>
              {user.fullName[0]}
            </Button>

            <div
              className={cn(
                "absolute bg-[var(--color-light)] right-0 mt-2 mr-2",
                "p-2 z-100 rounded-[10px]",
                "border border-[var(--color-dark)]",
                "shadow-[var(--shadow-brutalism-xs)]",
                onDropdown ? "block" : "hidden",
              )}
            >
              <Link to={"/dashboard"}>
                <div
                  className={cn(
                    "w-full text-[16px] font-medium",
                    "py-2 px-3 hover:bg-[var(--color-primary)] rounded-[8px]",
                    "hover:text-[var(--color-light)] transition-all",
                  )}
                >
                  Dashboard
                </div>
              </Link>
              <Button
                onClick={handleLogout}
                className={cn(
                  "!w-full !h-auto text-[16px] font-medium !py-2 !px-3",
                  "!justify-start hover:bg-[var(--color-primary)] rounded-[8px]",
                  "hover:text-[var(--color-light)] transition-all",
                )}
              >
                Sign out
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Navbar;
