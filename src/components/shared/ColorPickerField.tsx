import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { RgbaColorPicker, type RgbaColor } from "react-colorful";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { contentStyles as styles } from "../../pages/Builder/Content/Content.styles";

interface ColorPickerFieldProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

function parseColor(cssColor: string): RgbaColor {
  if (!cssColor || cssColor === "transparent") return { r: 0, g: 0, b: 0, a: 0 };

  const hexMatch = cssColor.match(/^#([0-9a-fA-F]{3,8})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
    return { r, g, b, a: Math.round(a * 100) / 100 };
  }

  const rgbaMatch = cssColor.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?\)/i);
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1]),
      g: parseInt(rgbaMatch[2]),
      b: parseInt(rgbaMatch[3]),
      a: rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1,
    };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}

function rgbaToString(color: RgbaColor): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.round(color.a * 100) / 100})`;
}

function ColorPickerField({ value, onChange, className }: ColorPickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const rgbaValue = useMemo(() => parseColor(value || "#000000"), [value]);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8 + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const handleChange = useCallback(
    (newColor: RgbaColor) => {
      onChange(rgbaToString(newColor));
    },
    [onChange],
  );

  return (
    <div className={className}>
      <div className="grid grid-cols-[26px_auto] gap-2">
        <Button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="!w-[26px] h-[26px] border border-[var(--color-primary)]/30"
          style={{
            backgroundColor: value || "#000000",
          }}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className={styles.contentInput}
        />
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            className="absolute z-[9999] mt-1 bg-white border border-[var(--color-dark)]/10 rounded-lg shadow-lg"
            style={{ top: position.top, left: position.left }}
          >
            <RgbaColorPicker color={rgbaValue} onChange={handleChange} />
          </div>,
          document.body,
        )}
    </div>
  );
}

export default React.memo(ColorPickerField);
