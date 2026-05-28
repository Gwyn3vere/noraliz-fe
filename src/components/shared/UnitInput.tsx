import React, { useState, useCallback, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface UnitInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  units?: string[];
}

function parseValue(raw: string): { num: string; unit: string } {
  if (!raw) return { num: "", unit: "px" };
  const match = raw.match(/^(-?\d*\.?\d+)\s*(px|%|vw|vh|em|rem|deg|turn|rad|auto)?$/);
  if (match) {
    return { num: match[1], unit: match[2] || "px" };
  }
  return { num: "", unit: raw };
}

export function UnitInput({
  value,
  onChange,
  placeholder = "0",
  className,
  units = ["px", "%", "vw", "vh", "em", "rem", "deg"],
}: UnitInputProps) {
  const [localNum, setLocalNum] = useState("");
  const [localUnit, setLocalUnit] = useState("px");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFocused) {
      const parsed = parseValue(value);
      setLocalNum(parsed.num);
      setLocalUnit(parsed.unit || "px");
    }
  }, [value, isFocused]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setLocalNum(raw);

      const unitRegex = new RegExp(`(${units.join("|")})$`);
      const unitMatch = raw.match(unitRegex);
      if (unitMatch) {
        const unit = unitMatch[0];
        const numPart = raw.slice(0, -unit.length).trim();
        setLocalUnit(unit);
        if (numPart) {
          onChange(`${numPart}${unit}`);
        } else {
          onChange(`0${unit}`);
        }
      } else {
        if (raw) {
          onChange(`${raw}${localUnit}`);
        } else {
          onChange("");
        }
      }
    },
    [localUnit, onChange, units],
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    const parsed = parseValue(value);
    setLocalNum(parsed.num);
    setLocalUnit(parsed.unit || "px");
  }, [value]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (!localNum) {
      onChange("");
    }
  }, [localNum, onChange]);

  const cycleUnit = useCallback(() => {
    const currentIndex = units.indexOf(localUnit);
    const nextIndex = (currentIndex + 1) % units.length;
    const newUnit = units[nextIndex];
    setLocalUnit(newUnit);
    if (localNum) {
      onChange(`${localNum}${newUnit}`);
    }
  }, [localUnit, localNum, units, onChange]);

  return (
    <div className="relative flex items-center">
      <Input
        ref={inputRef}
        type="text"
        value={isFocused ? localNum : value ? parseValue(value).num : ""}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={cn("pr-12", className)}
      />
      <button
        type="button"
        className="absolute right-1 top-1/2 -translate-y-1/2 text-[11px] font-medium text-[var(--color-dark)]/50 bg-[var(--color-light)] px-1.5 py-0.5 rounded hover:bg-[var(--color-dark)]/10 transition-colors"
        onClick={cycleUnit}
        title="Click to change unit"
      >
        {localUnit}
      </button>
    </div>
  );
}
