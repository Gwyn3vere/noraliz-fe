import { cn } from "@/lib/utils";

export const builderStyles = {
  // Left Panel component
  lPanelContainer: cn(
    "relative z-40",
    "flex flex-col",
    "w-[260px] h-screen",
    "bg-[var(--color-light)] shadow-[var(--shadow-xs)]",
  ),
  lPanelLogoBlock: cn("h-[100px] px-[20px] border-b border-[var(--color-dark)]/10"),
  lPanelLogoLayout: cn("flex items-center gap-2.5 pt-[20px]"),
  lPanelLogo: cn("w-[50px] h-[50px] rounded-[10px] bg-[var(--color-primary)]"),
  lPanelLogoBrand: cn("font-display font-bold text-[30px]"),
  lPanelSearchContainer: cn("h-[80px] border-b border-[var(--color-dark)]/10 px-[20px]"),
  lPanelSearchIcon: cn("absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[var(--color-dark)]/40"),
  lPanelSearchInput: cn("pl-9 my-[20px] w-full !h-[40px] bg-[var(--color-light)]"),
  lPanelDropdownContainer: cn("flex-1 flex flex-col gap-[12px]", "p-[20px] overflow-auto hover-scrollbar"),

  // Category component
  cateContainer: cn("flex items-center justify-between"),
  cateToggle: cn("flex items-center gap-[7px]", "hover:text-[var(--color-primary)]", "cursor-pointer transition-all"),
  cateMenu: cn(
    "flex items-center justify-center",
    "bg-linear-[var(--color-gradient-soon)]",
    "h-[20px] w-[60px] rounded-full",
  ),
  cateLabel: cn("text-[13px] font-bold text-white"),

  // Dropdown component
  dropdownContainer: cn("overflow-hidden transition-all duration-300 ease-in-out space-y-1"),
  dropdownLabel: cn(
    "flex items-center",
    "pl-[23px] h-[35px] rounded-[10px]",
    "cursor-pointer transition-all text-[14px]",
  ),

  // Menu component
  menuContainer: cn("absolute top-0 left-[260px] z-10 h-screen"),
  menuBackdrop: cn("absolute inset-0 bg-[var(--color-dark)]/30 transition-opacity duration-250 ease-in-out"),
  menuPanel: cn(
    "relative z-20 bg-[#FBFBFB] h-screen border-l border-[var(--color-dark)]/10",
    "transition-all duration-300 ease-in-out overflow-hidden",
  ),
  menuPanelHeaderSize: cn("h-[100px] px-[20px]"),
  menuPanelHeaderSpace: cn("space-y-[20px] pt-[20px]"),
  menuPanelHeaderTitle: cn("h-[20px] flex items-center justify-between"),
  menuPanelHeaderTitleLayout: cn("flex items-center gap-[5px]"),
  menuPanelHeaderTitleText: cn("text-[14px] font-medium uppercase"),
  menuPanelHeaderCategory: cn("flex items-center justify-between"),
  menuPanelHeaderCategoryLabel: cn("text-[30px] font-bold leading-none"),
  menuPanelHeaderCategoryButton: cn("h-[40px] w-[40px] border border-[var(--color-dark)]/40 !rounded-[10px]"),
  menuPanelList: cn("grid grid-cols-2 gap-5"),
  menuPanelBlock: cn(
    "border border-[var(--color-dark)]/10 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5",
    "w-[180px] h-[180px] flex flex-col items-center justify-center gap-2 p-3 rounded-xl",
    "bg-[var(--color-light)] cursor-pointer transition-all group",
  ),
  menuPanelBlockLabel: cn(
    "text-xs font-medium text-[var(--color-dark)]/70",
    "group-hover:text-[var(--color-primary)] text-center leading-tight",
  ),
  menuPanelThumbail: cn(
    "w-16 h-16 rounded-lg bg-[var(--color-dark)]/5",
    "flex items-center justify-center overflow-hidden",
  ),
  menuPanelThumbailImg: cn("w-full h-full object-cover"),
  menuPanelThumbailLabel: cn("text-lg font-bold text-[var(--color-dark)]/30"),

  // Canvas component
  canvasInteraction: cn("absolute flex items-center gap-2.5"),
  canvasProjectIcon: cn("absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]"),
  canvasProjectInput: cn(
    "pl-[40px] shadow-[var(--shadow-xs)] !text-[13px] font-semibold",
    "border-none bg-[var(--color-light)] !w-[260px] !h-[40px]",
  ),
  canvasButton: cn("w-[40px] h-[40px] !rounded-[10px] bg-[var(--color-light)] shadow-[var(--shadow-xs)]"),
  canvasButtonBorder: cn("!w-[120px] !bg-[var(--color-primary)] border-3 border-[var(--color-light)]"),
  canvasButtonHover: cn("hover:bg-[var(--color-primary)] hover:!text-white"),
  canvasButtonView: cn("shadow-none border-3 border-[var(--color-light)]"),
  canvasStatus: cn(
    "w-[200px] h-[40px] flex items-center justify-center gap-2.5",
    "text-[13px] font-medium",
    "rounded-[10px] shadow-[var(--shadow-xs)] bg-[var(--color-light)]",
  ),
  canvasText: cn("text-[13px] font-semibold"),
  canvasViewMode: cn("!w-[120px] flex items-center justify-between"),
  canvasZoombar: cn(
    "rounded-[10px] flex items-center justify-between bg-[var(--color-light)] shadow-[var(--shadow-xs)]",
  ),
};
