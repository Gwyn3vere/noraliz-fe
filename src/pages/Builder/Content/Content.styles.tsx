import { cn } from "@/lib/utils";

export const contentStyles = {
  contentPrivewImage: cn("w-full h-[120px] rounded-md overflow-hidden border border-[var(--color-dark)]/10"),
  contentUploadLabel: cn(
    "flex items-center justify-center",
    "h-[34px] rounded-md cursor-pointer transition-colors text-[12px] text-white",
    "bg-[var(--color-primary)]/90 hover:bg-[var(--color-primary)]",
  ),
  contentInput: cn("!w-full !h-[26px] !rounded-[6px] !text-[11px] border-none bg-[var(--color-primary)]/10"),
  contentSelect: cn("text-[11px] cursor-pointer hover:bg-[var(--color-primary)]/10"),
  contentTextarea: cn(
    "!min-h-[60px] !text-[11px] font-medium border-none bg-[var(--color-primary)]/10 !rounded-[6px] active-scrollbar",
  ),
};
