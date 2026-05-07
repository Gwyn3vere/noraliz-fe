import { Tailspin } from "ldrs/react";
import "ldrs/react/Tailspin.css";

export default function InlineLoader({ tab }: { tab: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen mx-[15px]">
      <div className="flex items-center gap-5 bg-[var(--color-light)] rounded-full h-auto p-4 shadow-[var(--shadow-sm)]">
        <Tailspin size="40" stroke="5" speed="0.9" color="var(--color-primary)" />
        Loading {tab} collections...
      </div>
    </div>
  );
}
