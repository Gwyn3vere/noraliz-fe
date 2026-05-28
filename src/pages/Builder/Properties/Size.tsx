// src/pages/Builder/SizePanel.tsx
import React, { useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import FieldRow from "../Content/FieldRow";
import { useStyleUpdater } from "@/components/hooks/useStyleUpdater";
import { contentStyles as styles } from "../Content/Content.styles";
import { UnitInput } from "@/components/shared/UnitInput";
import { cn } from "@/lib/utils";
import { EyeSlashIcon, EyeIcon, MouseScrollIcon, CircleIcon } from "@phosphor-icons/react";

const OVERFLOW_OPTIONS = [
  { value: "auto", label: "Auto", icon: null },
  { value: "visible", label: "Visible", icon: EyeIcon },
  { value: "hidden", label: "Hidden", icon: EyeSlashIcon },
  { value: "scroll", label: "Scroll", icon: MouseScrollIcon },
  { value: "initial", label: "Initial", icon: CircleIcon },
];

function Size() {
  const { currentStyles, updateStyles } = useStyleUpdater();
  const overflowValue = currentStyles.overflow || "visible";

  const updateProperty = useCallback(
    (property: string, value: string) => {
      updateStyles({ [property]: value });
    },
    [updateStyles],
  );

  return (
    <div className="space-y-3">
      {/* Width & Height */}
      <div className="grid grid-cols-2 gap-2">
        <FieldRow label="Width">
          <UnitInput
            value={currentStyles.width || ""}
            onChange={(val) => updateProperty("width", val)}
            placeholder="auto"
            className={styles.contentInput}
          />
        </FieldRow>
        <FieldRow label="Height">
          <UnitInput
            value={currentStyles.height || ""}
            onChange={(val) => updateProperty("height", val)}
            placeholder="auto"
            className={styles.contentInput}
          />
        </FieldRow>
      </div>

      {/* Min / Max */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <FieldRow label="Min W">
            <UnitInput
              value={currentStyles.minWidth || ""}
              onChange={(val) => updateProperty("minWidth", val)}
              placeholder="0"
              className={styles.contentInput}
            />
          </FieldRow>
          <FieldRow label="Max W">
            <UnitInput
              value={currentStyles.maxWidth || ""}
              onChange={(val) => updateProperty("maxWidth", val)}
              placeholder="none"
              className={styles.contentInput}
            />
          </FieldRow>
          <FieldRow label="Min H">
            <UnitInput
              value={currentStyles.minHeight || ""}
              onChange={(val) => updateProperty("minHeight", val)}
              placeholder="0"
              className={styles.contentInput}
            />
          </FieldRow>
          <FieldRow label="Max H">
            <UnitInput
              value={currentStyles.maxHeight || ""}
              onChange={(val) => updateProperty("maxHeight", val)}
              placeholder="none"
              className={styles.contentInput}
            />
          </FieldRow>
        </div>
      </div>

      {/* Box Sizing */}
      <FieldRow label="Box Sizing">
        <Select
          value={currentStyles.boxSizing || "content-box"}
          onValueChange={(val) => updateProperty("boxSizing", val)}
        >
          <SelectTrigger className={styles.contentInput}>
            <SelectValue placeholder="content-box" />
          </SelectTrigger>
          <SelectContent className="border-none bg-white">
            {["content-box", "border-box"].map((v) => (
              <SelectItem key={v} value={v} className={styles.contentSelect}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>

      {/* Resize */}
      <FieldRow label="Resize">
        <Select value={currentStyles.resize || "none"} onValueChange={(val) => updateProperty("resize", val)}>
          <SelectTrigger className={styles.contentInput}>
            <SelectValue placeholder="none" />
          </SelectTrigger>
          <SelectContent className="border-none bg-white">
            {["none", "both", "horizontal", "vertical"].map((v) => (
              <SelectItem key={v} value={v} className={styles.contentSelect}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>

      {/* Overflow */}
      <div className="flex items-center gap-1">
        {OVERFLOW_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <Button
              key={opt.value}
              type="button"
              className={cn(
                "w-[26px] h-[26px] text-[10px] font-medium",
                overflowValue === opt.value
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-primary)]/10 text-[var(--color-dark)] hover:bg-[var(--color-primary)]/20",
              )}
              onClick={() => updateProperty("overflow", opt.value)}
              title={opt.label}
            >
              {Icon ? <Icon size={14} /> : <span className="text-[10px] font-medium">A</span>}
            </Button>
          );
        })}

        <Select value={currentStyles.resize || "none"} onValueChange={(val) => updateProperty("resize", val)}>
          <SelectTrigger className={styles.contentInput} title="Aspect Ratio">
            <SelectValue placeholder="none" />
          </SelectTrigger>
          <SelectContent className="border-none bg-white">
            {["none", "both", "horizontal", "vertical"].map((v) => (
              <SelectItem key={v} value={v} className={styles.contentSelect}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default React.memo(Size);
