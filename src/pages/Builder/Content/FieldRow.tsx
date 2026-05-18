import React from "react";
import { Label } from "@/components/ui/label";

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <Label className="text-[11px] font-medium text-[var(--color-dark)]/50 uppercase tracking-wide">{label}</Label>
      {children}
    </div>
  );
}

export default React.memo(FieldRow);
