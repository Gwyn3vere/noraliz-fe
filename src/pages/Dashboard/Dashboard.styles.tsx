import { cn } from "@/lib/utils";

// nav
const navBase = "bg-[var(--color-light)]";
const navSize = "w-full h-auto md:h-[60px]";
const navPosition = "fixed top-[70px] md:top-[100px]";
const navSpace = "px-[15px] md:px-[180px]";
const navLayout = "md:flex items-center";

// tab
const tabBase = "cursor-pointer select-none border-b";
const tabLayout = "flex flex-col md:flex-row items-center gap-1 md:gap-2";
const tabSize = ":w-auto h-full";
const tabSpace = "px-[16px]";

const tabTextBase = "text-[13px] md:text-[15px] font-medium";

export const dashboardStyles = {
  navContainer: cn(navBase, navPosition, navSize, navSpace, navLayout),
  tabButton: cn(tabBase, tabLayout, tabSize, tabSpace),
  tabContent: cn(tabTextBase),
};
