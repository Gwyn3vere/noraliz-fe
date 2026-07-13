import { cn } from "@/lib/utils";

export const landingStyles = {
  navButton: cn(
    "w-[40px] h-[40px] !rounded-[10px]",
    "bg-[var(--color-light)] mr-2.5",
    "flex items-center-justify-center",
    "border border-[var(--color-dark)]",
    "shadow-[var(--shadow-brutalism-xs)]",
  ),
  navMenu: cn(
    "w-full h-[40px] rounded-[10px]",
    "flex items-center justify-center",
    "text-[16px] font-medium md:font-bold",
    "border border-transparent",

    "hover:shadow-[var(--shadow-brutalism-xs)]",
    "hover:border-[var(--color-dark)]",
    "hover:bg-[var(--color-primary)]",
    "hover:text-[var(--color-light)]",

    "md:hover:shadow-none",
    "md:hover:border-transparent",
    "md:hover:bg-transparent",
    "md:hover:text-[var(--color-primary)]",

    "transition-ease duration-200",
  ),
  ctaButton: cn(
    "w-auto h-[50px] px-6 py-3",
    "bg-[var(--color-primary)] !rounded-full",
    "border border-[var(--color-dark)]",
    "shadow-[var(--shadow-brutalism-xs)]",
    "hover:shadow-[var(--shadow-brutalism-xl)]",
    "hover:bg-[var(--color-primary-hover)]",
    "text-[var(--color-light)] text-[16px] !font-bold",
    "transition-all",
  ),
};
