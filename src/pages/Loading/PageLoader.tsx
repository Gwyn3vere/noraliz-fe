import { cn } from "@/lib/utils";
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";

interface GlobalLoaderProps {
  className?: string;
}

export function PageLoader({ className }: GlobalLoaderProps) {
  return (
    <div className={cn("min-h-screen flex flex-col items-center justify-center gap-6", className)}>
      {/* Logo tối giản */}
      <div className="font-display text-4xl font-bold text-[var(--color-dark)] tracking-tight">NORALIZ</div>
      {/* Spinner nhẹ */}
      <Ring size="40" stroke="5" bgOpacity="0" speed="2" color="var(--color-primary)" />
    </div>
  );
}
