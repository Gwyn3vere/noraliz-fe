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
const emptyBase = "bg-[var(--color-light)] rounded-[10px] mx-[15px]";
const emptySize = " w-[1080px] h-[420px]";
const emptyLayout = "flex flex-col items-center justify-center gap-5";

const emptyTextLayout = "flex flex-col items-center";
const emptyTextBase = "text-md md:text-[20px] font-medium text-center";

const emptyButtonBase =
  "text-white text-[13px] md:text-[15px] bg-[var(--color-primary)] !rounded-[10px] cursor-pointer";

// content
const contentSpace = "mt-[120px] md:mt-[140px]";

// card
const cardBase = "bg-[var(--color-light)] rounded-[10px]";
const cardShadow = "!shadow-[var(--shadow-brutalism-xs)]";
const cardSize = "w-auto h-auto";
const cardBorder = "border border-[var(--color-dark)]";

const cardThumbBase = "bg-[var(--color-dark)]/5";
const cardThumbSize = "w-full h-[200px]";

// asset
const assetBase = "bg-[var(--color-light)] shadow-[var(--shadow-brutalism-xs)] rounded-[10px] overflow-hidden";
const assetPosition = "relative";

const assetHover = "bg-[var(--color-dark)]/40 opacity-0 group-hover:opacity-100 cursor-pointer";

// img
const imgSize = "w-[180px] h-[180px] lg:w-[200px] lg:h-[200px]";
const imgLayout = "flex items-center justify-center";

const imgCopy = "bg-[var(--color-dark)]/40 cursor-pointer text-white";
const imgTrans = "transition-all duration-300";

const imgLoading = "absolute inset-0";

// metadata
const metaBase = "text-[13px] xl:text-[15px] text-[var(--color-dark)]/50 py-1";
const metaLayout = "flex items-center gap-[20px]";

const metaButtonBase = "cursor-pointer hover:bg-[var(--color-primary)] hover:text-white !rounded-[10px]";
const metaButtonSize = "w-[40px] h-[40px]";

export const dashboardStyles = {
  navContainer: cn(navBase, navPosition, navSize, navSpace, navLayout),
  tabButton: cn(tabBase, tabLayout, tabSize, tabSpace),
  tabContent: cn(tabTextBase),

  wrapper: cn(wrapperLayout, wrapperSize),
  empty: cn(emptyBase, emptyLayout, emptySize, "border border-[var(--color-dark)]", "shadow-[var(--shadow-brutalism)]"),
  emptyText: cn(emptyTextBase, emptyTextLayout),
  emptyButton: cn(emptyButtonBase, cardBorder, cardShadow),

  inputSearch: cn("rounded-[10px]", cardBorder, cardShadow),

  contentContainer: cn("h-full", navSpace, contentSpace),

  cardContainer: cn(cardBase, cardSize, cardBorder, cardShadow),
  cardThumb: cn(cardThumbBase, cardThumbSize),
  cardHover: cn(assetHover, cardThumbSize, imgLoading, cardThumbBase, imgTrans, wrapperLayout),
  cardButton: cn(
    "bg-[var(--color-primary)] py-4 px-6 rounded-[10px] " +
      "font-medium text-[14px] text-white" +
      " flex items-center gap-1",
    cardBorder,
    cardShadow,
  ),

  assetContainer: cn(assetBase, assetPosition),
  assetCopy: cn(imgCopy, imgLoading, imgLayout, imgTrans),
  assetSee: cn("!text-xl", assetHover, imgSize, imgLoading, imgTrans),

  images: cn(imgSize, imgLayout),
  loading: cn(imgLoading),

  meta: cn(metaBase, metaLayout),
  metaButton: cn(metaButtonBase, metaButtonSize),
  controlButton: cn("justify-between", metaBase, metaLayout),
};
