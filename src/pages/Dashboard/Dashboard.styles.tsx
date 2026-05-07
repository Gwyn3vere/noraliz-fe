import { cn } from "@/lib/utils";

// nav
const navBase = "bg-[var(--color-light)]";
const navSize = "w-full h-auto md:h-[60px]";
const navPosition = "fixed top-[70px] md:top-[100px] z-5";
const navSpace = "px-[15px] md:px-[60px] xl:px-[180px]";
const navLayout = "md:flex items-center";

// tab
const tabBase = "cursor-pointer select-none border-b";
const tabLayout = "flex flex-col md:flex-row items-center gap-1 md:gap-2";
const tabSize = ":w-auto h-full";
const tabSpace = "px-[16px]";

const tabTextBase = "text-[13px] md:text-[15px] font-medium";

// wrapper
const wrapperLayout = "flex items-center justify-center";
const wrapperSize = "min-h-screen";

// empty
const emptyBase = "bg-[var(--color-light)] rounded-[30px] mx-[15px]";
const emptySize = " w-[1080px] h-[420px]";
const emptyLayout = "flex flex-col items-center justify-center gap-5";

const emptyTextLayout = "flex flex-col items-center";
const emptyTextBase = "text-md md:text-[20px] font-medium text-center";

const emptyButtonBase = "text-xs text-white bg-[var(--color-primary)] !rounded-[10px] cursor-pointer";

// content
const contentSpace = "mt-[160px]";

// card
const cardBase = "bg-[var(--color-light)] rounded-[30px] shadow-[var(--shadow-xs)]";
const cardSize = "w-full h-auto";

const cardThumbBase = "bg-[var(--color-dark)]/15 rounded-[30px] border-10 border-white";
const cardThumbSize = "w-full h-[280px]";

export const dashboardStyles = {
  navContainer: cn(navBase, navPosition, navSize, navSpace, navLayout),
  tabButton: cn(tabBase, tabLayout, tabSize, tabSpace),
  tabContent: cn(tabTextBase),

  wrapper: cn(wrapperLayout, wrapperSize),
  empty: cn(emptyBase, emptyLayout, emptySize),
  emptyText: cn(emptyTextBase, emptyTextLayout),
  emptyButton: cn(emptyButtonBase),

  contentContainer: cn("h-full", navSpace, contentSpace),

  cardContainer: cn(cardBase, cardSize),
  cardThumb: cn(cardThumbBase, cardThumbSize),
};
