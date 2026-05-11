import { cn } from "@/lib/utils";

// container
const containerSize = "h-screen w-full";
const containerLayout = "flex items-center justify-center";

export const loaderStyles = {
  container: cn(containerSize, containerLayout),
  brandWrapper: "relative inline-block my-5",
  brandDark: "font-display text-[70px] font-black leading-none text-[var(--color-dark)]",
  brandOrange:
    "absolute inset-0 font-display text-[70px] font-black leading-none text-[var(--color-primary)] overflow-hidden " +
    "transition-[width] duration-50 ease-linear",
};
