import classNames from "classnames/bind";
import { dashboardStyles as styles } from "./Dashboard.styles";
import type { TabMenuType } from "@/types";
import { TAB_MENU } from "@/constants/tabMenu";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const cx = classNames.bind(styles);

type Props = {
  tab: TabMenuType;
  onChangeTab: (tab: TabMenuType) => void;
};

export default function Navigation({ tab, onChangeTab }: Props) {
  return (
    <nav className={styles.navContainer}>
      <div className="flex items-center h-full w-full justify-between md:justify-start">
        {TAB_MENU.map((nav) => {
          const Icon = nav.icon;
          return (
            <div
              key={nav.id}
              onClick={() => onChangeTab(nav.value)}
              className={cx(
                styles.tabButton,
                tab === nav.value ? "text-[var(--color-dark)]" : "text-[var(--color-dark)]/40",
                tab === nav.value ? "border-[var(--color-primary)]" : "border-transparent",
              )}
            >
              <span className={tab === nav.value ? "text-[var(--color-primary)]" : ""}>
                <Icon size={24} weight={tab === nav.value ? "fill" : "regular"} />
              </span>{" "}
              <span className={cx(styles.tabContent)}>{nav.title}</span>
            </div>
          );
        })}
      </div>
      <div className={cn("relative block md:hidden", styles.inputSearch)}>
        <MagnifyingGlassIcon
          size={17}
          weight="bold"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[var(--color-dark)]/40"
        />
        <Input
          type="search"
          placeholder=" Search..."
          className={cn("pl-9 w-full !h-[40px] !border-2 !border-[var(--color-dark)]")}
        />
      </div>
    </nav>
  );
}
