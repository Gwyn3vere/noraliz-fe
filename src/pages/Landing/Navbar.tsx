import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { landingStyles as styles } from "./Landing.styles";
import { useState } from "react";
import { NAV_MENU_LDP } from "@/constants/tabMenu";
import { Link } from "react-router-dom";

function Navbar() {
  const [toggleNav, setToggleNav] = useState(false);

  const handleToggle = () => {
    setToggleNav((prev) => !prev);
  };

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
                <Link to={nav.sectionId} key={nav.id}>
                  <div className={cn(styles.navMenu)}>{nav.title}</div>
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* Button */}
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
      </div>
    </section>
  );
}

export default Navbar;
