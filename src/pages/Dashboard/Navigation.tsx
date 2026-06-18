import classNames from "classnames/bind";
import { dashboardStyles as styles } from "./Dashboard.styles";
import type { TabMenuType } from "@/types";
import { TAB_MENU } from "@/constants/tabMenu";

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
    </nav>
  );
}
