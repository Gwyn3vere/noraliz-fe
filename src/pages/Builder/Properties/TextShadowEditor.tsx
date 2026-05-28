import { useCallback, useMemo, useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ColorPickerField from "@/components/shared/ColorPickerField";
import { cn } from "@/lib/utils";
import { contentStyles as styles } from "../Content/Content.styles";
import FieldRow from "../Content/FieldRow";

interface ShadowValue {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}

const PRESETS: Record<string, string> = {
  none: "none",
  subtle: "1px 1px 2px rgba(0,0,0,0.2)",
  glow: "0 0 8px rgba(255,255,255,0.8)",
  sharp: "2px 2px 0 rgba(0,0,0,0.3)",
  retro: "3px 3px 0 rgba(0,0,0,0.5)",
};

function parseShadow(css: string): ShadowValue {
  if (!css || css === "none") {
    return { offsetX: 0, offsetY: 0, blur: 0, color: "#000000" };
  }
  // Tách chuỗi kiểu "2px 2px 4px rgba(0,0,0,0.5)"
  const parts = css.match(/(-?\d+px)\s+(-?\d+px)\s+(\d+px)\s+(.+)/);
  if (parts) {
    return {
      offsetX: parseInt(parts[1]),
      offsetY: parseInt(parts[2]),
      blur: parseInt(parts[3]),
      color: parts[4],
    };
  }
  // Fallback
  return { offsetX: 2, offsetY: 2, blur: 4, color: "rgba(0,0,0,0.3)" };
}

function buildShadowString(v: ShadowValue): string {
  return `${v.offsetX}px ${v.offsetY}px ${v.blur}px ${v.color}`;
}

interface TextShadowEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextShadowEditor({ value, onChange }: TextShadowEditorProps) {
  const initialShadow = useMemo(() => parseShadow(value), [value]);
  const [mode, setMode] = useState<"preset" | "custom">(Object.values(PRESETS).includes(value) ? "preset" : "custom");
  const [shadow, setShadow] = useState<ShadowValue>(initialShadow);

  useEffect(() => {
    const parsed = parseShadow(value);
    setShadow(parsed);
    setMode(Object.values(PRESETS).includes(value) ? "preset" : "custom");
  }, [value]);

  const selectedPresetKey = Object.keys(PRESETS).find((k) => PRESETS[k] === value) || "none";

  const handlePresetChange = useCallback(
    (key: string) => {
      if (key === "custom") {
        setMode("custom");
        onChange(buildShadowString(shadow));
      } else {
        const newValue = PRESETS[key] || "none";
        setMode("preset");
        onChange(newValue);
        setShadow(parseShadow(newValue));
      }
    },
    [onChange, shadow],
  );

  const updateShadow = useCallback(
    (partial: Partial<ShadowValue>) => {
      const updated = { ...shadow, ...partial };
      setShadow(updated);
      setMode("custom");
      onChange(buildShadowString(updated));
    },
    [shadow, onChange],
  );

  return (
    <div className="space-y-2">
      <Select value={mode === "preset" ? selectedPresetKey : "custom"} onValueChange={handlePresetChange}>
        <SelectTrigger className={cn(styles.contentInput)}>
          <SelectValue placeholder="Shadow" />
        </SelectTrigger>
        <SelectContent className="border-none bg-white">
          {Object.keys(PRESETS).map((key) => (
            <SelectItem key={key} value={key} className={styles.contentSelect}>
              {key}
            </SelectItem>
          ))}
          <SelectItem value="custom" className={styles.contentSelect}>
            Custom
          </SelectItem>
        </SelectContent>
      </Select>

      <div className="grid grid-cols-3 gap-2">
        <FieldRow label="X">
          <Input
            type="number"
            value={shadow.offsetX}
            onChange={(e) => updateShadow({ offsetX: parseInt(e.target.value) || 0 })}
            className={styles.contentInput}
          />
        </FieldRow>

        <FieldRow label="Y">
          <Input
            type="number"
            value={shadow.offsetY}
            onChange={(e) => updateShadow({ offsetY: parseInt(e.target.value) || 0 })}
            className={styles.contentInput}
          />
        </FieldRow>

        <FieldRow label="Blur">
          <Input
            type="number"
            value={shadow.blur}
            onChange={(e) => updateShadow({ blur: parseInt(e.target.value) || 0 })}
            className={styles.contentInput}
          />
        </FieldRow>
      </div>

      <ColorPickerField value={shadow.color} onChange={(color) => updateShadow({ color })} />
    </div>
  );
}
