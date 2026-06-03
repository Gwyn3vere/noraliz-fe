import React, { useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FieldRow from "../Content/FieldRow";
import { UnitInput } from "@/components/shared/UnitInput";
import { useStyleUpdater } from "@/components/hooks/useStyleUpdater";
import { contentStyles as styles } from "../Content/Content.styles";
import { cn } from "@/lib/utils";

function parseTransformValues(transform: string): { x: string; y: string } {
  if (!transform) return { x: "", y: "" };
  const matchX = transform.match(/translateX\(([^)]+)\)/);
  const matchY = transform.match(/translateY\(([^)]+)\)/);
  return {
    x: matchX ? matchX[1] : "",
    y: matchY ? matchY[1] : "",
  };
}

function Position() {
  const { currentStyles, updateStyles } = useStyleUpdater();

  const position = currentStyles.position || "static";
  const zIndex = currentStyles.zIndex ?? "";
  const float = currentStyles.float || "none";
  const clear = currentStyles.clear || "none";
  const visibility = currentStyles.visibility || "visible";

  const top = currentStyles.top || "";
  const right = currentStyles.right || "";
  const bottom = currentStyles.bottom || "";
  const left = currentStyles.left || "";

  const currentTransform = currentStyles.transform || "";
  const parsed = useMemo(() => parseTransformValues(currentTransform), [currentTransform]);

  const updateTransform = useCallback(
    (axis: "x" | "y", value: string) => {
      const newX = axis === "x" ? value : parsed.x;
      const newY = axis === "y" ? value : parsed.y;

      const xPart = newX ? `translateX(${newX})` : "";
      const yPart = newY ? `translateY(${newY})` : "";

      const newTransform = [xPart, yPart].filter(Boolean).join(" ");
      updateStyles({ transform: newTransform || undefined });
    },
    [parsed, updateStyles],
  );
  const updateOffset = useCallback(
    (property: string, value: string) => {
      const num = value === "" ? "" : parseInt(value, 10);
      updateStyles({ [property]: num !== "" ? `${num}px` : "" });
    },
    [updateStyles],
  );

  const isPositioned = position !== "static";

  return (
    <div className="space-y-3">
      <FieldRow label="Position">
        <Select value={position} onValueChange={(val) => updateStyles({ position: val })}>
          <SelectTrigger className={styles.contentInput}>
            <SelectValue placeholder="static" />
          </SelectTrigger>
          <SelectContent className="border-none bg-white">
            {["static", "relative", "absolute", "sticky"].map((v) => (
              <SelectItem key={v} value={v} className={styles.contentSelect}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>

      {isPositioned && (
        <>
          <FieldRow label="Offsets">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-[var(--color-dark)]/40 uppercase w-4">T</span>

                <UnitInput
                  value={top}
                  onChange={(val) => updateOffset("top", val)}
                  placeholder="auto"
                  className={cn(styles.contentInput)}
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-[var(--color-dark)]/40 uppercase w-4">B</span>

                <UnitInput
                  value={bottom}
                  onChange={(val) => updateOffset("bottom", val)}
                  placeholder="auto"
                  className={cn(styles.contentInput)}
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-[var(--color-dark)]/40 uppercase w-4">L</span>

                <UnitInput
                  value={left}
                  onChange={(val) => updateOffset("left", val)}
                  placeholder="auto"
                  className={cn(styles.contentInput)}
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-[var(--color-dark)]/40 uppercase w-4">R</span>
                <UnitInput
                  value={right}
                  onChange={(val) => updateOffset("right", val)}
                  placeholder="auto"
                  className={cn(styles.contentInput)}
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-[var(--color-dark)]/40 uppercase w-4">X</span>
                <UnitInput
                  value={parsed.x}
                  onChange={(val) => updateTransform("x", val)}
                  placeholder="0"
                  className={cn(styles.contentInput)}
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-[var(--color-dark)]/40 uppercase w-4">Y</span>
                <UnitInput
                  value={parsed.y}
                  onChange={(val) => updateTransform("y", val)}
                  placeholder="0"
                  className={cn(styles.contentInput)}
                />
              </div>
            </div>
          </FieldRow>

          <FieldRow label="Z-Index">
            <Input
              type="number"
              value={zIndex}
              onChange={(e) => updateStyles({ zIndex: e.target.value })}
              placeholder="auto"
              className={cn(styles.contentInput)}
            />
          </FieldRow>
        </>
      )}

      <div className="grid grid-cols-2 gap-2">
        <FieldRow label="Float">
          <Select value={float} onValueChange={(val) => updateStyles({ float: val })}>
            <SelectTrigger className={styles.contentInput}>
              <SelectValue placeholder="none" />
            </SelectTrigger>
            <SelectContent className="border-none bg-white">
              {["none", "left", "right"].map((v) => (
                <SelectItem key={v} value={v} className={styles.contentSelect}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldRow>
        <FieldRow label="Clear">
          <Select value={clear} onValueChange={(val) => updateStyles({ clear: val })}>
            <SelectTrigger className={styles.contentInput}>
              <SelectValue placeholder="none" />
            </SelectTrigger>
            <SelectContent className="border-none bg-white">
              {["none", "left", "right", "both"].map((v) => (
                <SelectItem key={v} value={v} className={styles.contentSelect}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldRow>
      </div>

      <FieldRow label="Visibility">
        <Select value={visibility} onValueChange={(val) => updateStyles({ visibility: val })}>
          <SelectTrigger className={styles.contentInput}>
            <SelectValue placeholder="visible" />
          </SelectTrigger>
          <SelectContent className="border-none bg-white">
            {["visible", "hidden", "collapse"].map((v) => (
              <SelectItem key={v} value={v} className={styles.contentSelect}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>
    </div>
  );
}

export default React.memo(Position);
