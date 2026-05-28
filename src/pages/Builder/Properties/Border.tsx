import React, { useCallback, useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LinkSimpleIcon, LinkBreakIcon, SelectionAllIcon, SelectionIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import FieldRow from "../Content/FieldRow";
import { UnitInput } from "@/components/shared/UnitInput";
import ColorPickerField from "@/components/shared/ColorPickerField";
import { useStyleUpdater } from "@/components/hooks/useStyleUpdater";
import { contentStyles as styles } from "../Content/Content.styles";
import { cn } from "@/lib/utils";

const BORDER_STYLES = ["none", "solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"];
const CORNERS = [
  { key: "TopLeft", label: "TL" },
  { key: "TopRight", label: "TR" },
  { key: "BottomRight", label: "BR" },
  { key: "BottomLeft", label: "BL" },
];

type Side = "top" | "right" | "bottom" | "left";
const SIDES: Side[] = ["top", "right", "bottom", "left"];

function parseWidth(val: string | undefined): string {
  if (!val) return "";
  const num = parseInt(val, 10);
  return isNaN(num) ? "" : num.toString();
}
function getBorderValues(currentStyles: Record<string, any>, side: Side) {
  const cap = side.charAt(0).toUpperCase() + side.slice(1);
  return {
    width: parseWidth(currentStyles[`border${cap}Width`]),
    style: currentStyles[`border${cap}Style`] || "",
    color: currentStyles[`border${cap}Color`] || "",
  };
}
function makeBorderUpdate(side: Side, property: "Width" | "Style" | "Color", value: string) {
  const cap = side.charAt(0).toUpperCase() + side.slice(1);
  return { [`border${cap}${property}`]: value || undefined };
}

function parseRadius(val: string | undefined): string {
  if (!val) return "";
  const num = parseInt(val, 10);
  return isNaN(num) ? "" : num.toString();
}
function getRadiusValue(currentStyles: Record<string, any>, corner: string) {
  return parseRadius(currentStyles[`border${corner}Radius`]);
}
function makeRadiusUpdate(corner: string, value: string) {
  return { [`border${corner}Radius`]: value || undefined };
}

function BorderPanel() {
  const { currentStyles, updateStyles } = useStyleUpdater();

  const [expanded, setExpanded] = useState(false);
  const [topBottomLinked, setTopBottomLinked] = useState(true);
  const [leftRightLinked, setLeftRightLinked] = useState(true);

  const [radiusExpanded, setRadiusExpanded] = useState(false);
  const [topRadiusLinked, setTopRadiusLinked] = useState(true);
  const [bottomRadiusLinked, setBottomRadiusLinked] = useState(true);

  const borderValues = useMemo(() => {
    const result: Record<Side, { width: string; style: string; color: string }> = {} as any;
    SIDES.forEach((side) => {
      result[side] = getBorderValues(currentStyles, side);
    });
    return result;
  }, [currentStyles]);
  const radiusValues = useMemo(() => {
    const result: Record<string, string> = {};
    CORNERS.forEach((corner) => {
      result[corner.key] = getRadiusValue(currentStyles, corner.key);
    });
    return result;
  }, [currentStyles]);

  const allWidthEqual = SIDES.every((s) => borderValues[s].width === borderValues.top.width);
  const allStyleEqual = SIDES.every((s) => borderValues[s].style === borderValues.top.style);
  const allColorEqual = SIDES.every((s) => borderValues[s].color === borderValues.top.color);

  const allWidth = allWidthEqual ? borderValues.top.width : "";
  const allStyle = allStyleEqual ? borderValues.top.style : "";
  const allColor = allColorEqual ? borderValues.top.color : "";

  const allRadiusEqual = CORNERS.every((c) => radiusValues[c.key] === radiusValues.TopLeft);
  const allRadius = allRadiusEqual ? radiusValues.TopLeft : "";

  const updateAll = useCallback(
    (property: "Width" | "Style" | "Color", value: string) => {
      const updates: Record<string, any> = {};
      SIDES.forEach((side) => {
        Object.assign(updates, makeBorderUpdate(side, property, value));
      });
      updateStyles(updates);
    },
    [updateStyles],
  );
  const updateSingle = useCallback(
    (side: Side, property: "Width" | "Style" | "Color", value: string) => {
      const updates: Record<string, any> = {};
      Object.assign(updates, makeBorderUpdate(side, property, value));
      updateStyles(updates);
    },
    [updateStyles],
  );
  const updateColor = useCallback(
    (color: string) => {
      updateAll("Color", color);
    },
    [updateAll],
  );

  const updateAllRadius = useCallback(
    (value: string) => {
      const updates: Record<string, any> = {};
      CORNERS.forEach((corner) => {
        Object.assign(updates, makeRadiusUpdate(corner.key, value));
      });
      updateStyles(updates);
    },
    [updateStyles],
  );
  const updateSingleRadius = useCallback(
    (corner: string, value: string) => {
      const updates: Record<string, any> = {};
      Object.assign(updates, makeRadiusUpdate(corner, value));
      updateStyles(updates);
    },
    [updateStyles],
  );

  return (
    <div className="space-y-4">
      <FieldRow label="Color">
        <ColorPickerField value={allColor || "transparent"} onChange={updateColor} />
      </FieldRow>

      <div className="space-y-2">
        <FieldRow label="Border">
          <div className="flex items-center gap-1">
            <UnitInput
              value={allWidth}
              onChange={(val) => updateAll("Width", val)}
              placeholder="0"
              className={cn(styles.contentInput, "flex-1")}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="!w-4 !h-4"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <SelectionIcon size={12} /> : <SelectionAllIcon size={12} />}
            </Button>
          </div>
        </FieldRow>
        <Select
          value={allStyle || "__none__"}
          onValueChange={(val) => updateAll("Style", val === "__none__" ? "" : val)}
        >
          <SelectTrigger className={cn(styles.contentInput, "w-[100px]")}>
            <SelectValue placeholder="Style" />
          </SelectTrigger>
          <SelectContent className="border-none bg-white">
            <SelectItem value="__none__" className={styles.contentSelect}>
              None
            </SelectItem>
            {BORDER_STYLES.filter((s) => s !== "none").map((s) => (
              <SelectItem key={s} value={s} className={styles.contentSelect}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {expanded && (
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[var(--color-dark)]/40 uppercase w-4">T</span>
              <UnitInput
                value={borderValues.top.width}
                onChange={(val) => {
                  updateSingle("top", "Width", val);
                  if (topBottomLinked) updateSingle("bottom", "Width", val);
                }}
                placeholder="0"
                className={cn(styles.contentInput, "flex-1")}
              />
              <Select
                value={borderValues.top.style || "__none__"}
                onValueChange={(val) => {
                  const newVal = val === "__none__" ? "" : val;
                  updateSingle("top", "Style", newVal);
                  if (topBottomLinked) updateSingle("bottom", "Style", newVal);
                }}
              >
                <SelectTrigger className={cn(styles.contentInput, "w-[80px]")}>
                  <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent className="border-none bg-white">
                  <SelectItem value="__none__" className={styles.contentSelect}>
                    None
                  </SelectItem>
                  {BORDER_STYLES.filter((s) => s !== "none").map((s) => (
                    <SelectItem key={s} value={s} className={styles.contentSelect}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[var(--color-dark)]/40 uppercase w-4">B</span>
              <UnitInput
                value={borderValues.bottom.width}
                onChange={(val) => {
                  updateSingle("bottom", "Width", val);
                  if (topBottomLinked) updateSingle("top", "Width", val);
                }}
                placeholder="0"
                className={cn(styles.contentInput, "flex-1")}
              />
              <Select
                value={borderValues.bottom.style || "__none__"}
                onValueChange={(val) => {
                  const newVal = val === "__none__" ? "" : val;
                  updateSingle("bottom", "Style", newVal);
                  if (topBottomLinked) updateSingle("top", "Style", newVal);
                }}
              >
                <SelectTrigger className={cn(styles.contentInput, "w-[80px]")}>
                  <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent className="border-none bg-white">
                  <SelectItem value="__none__" className={styles.contentSelect}>
                    None
                  </SelectItem>
                  {BORDER_STYLES.filter((s) => s !== "none").map((s) => (
                    <SelectItem key={s} value={s} className={styles.contentSelect}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-full !h-[26px] bg-[var(--color-primary)] text-white"
              onClick={() => setTopBottomLinked(!topBottomLinked)}
              title={topBottomLinked ? "Unlink" : "Link"}
            >
              {topBottomLinked ? <LinkSimpleIcon size={10} /> : <LinkBreakIcon size={10} />}
            </Button>

            {/* Hàng Left / Right */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[var(--color-dark)]/40 uppercase w-4">L</span>
              <UnitInput
                value={borderValues.left.width}
                onChange={(val) => {
                  updateSingle("left", "Width", val);
                  if (leftRightLinked) updateSingle("right", "Width", val);
                }}
                placeholder="0"
                className={cn(styles.contentInput, "flex-1")}
              />
              <Select
                value={borderValues.left.style || "__none__"}
                onValueChange={(val) => {
                  const newVal = val === "__none__" ? "" : val;
                  updateSingle("left", "Style", newVal);
                  if (leftRightLinked) updateSingle("right", "Style", newVal);
                }}
              >
                <SelectTrigger className={cn(styles.contentInput, "w-[80px]")}>
                  <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent className="border-none bg-white">
                  <SelectItem value="__none__" className={styles.contentSelect}>
                    None
                  </SelectItem>
                  {BORDER_STYLES.filter((s) => s !== "none").map((s) => (
                    <SelectItem key={s} value={s} className={styles.contentSelect}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[var(--color-dark)]/40 uppercase w-4">R</span>
              <UnitInput
                value={borderValues.right.width}
                onChange={(val) => {
                  updateSingle("right", "Width", val);
                  if (leftRightLinked) updateSingle("left", "Width", val);
                }}
                placeholder="0"
                className={cn(styles.contentInput, "flex-1")}
              />
              <Select
                value={borderValues.right.style || "__none__"}
                onValueChange={(val) => {
                  const newVal = val === "__none__" ? "" : val;
                  updateSingle("right", "Style", newVal);
                  if (leftRightLinked) updateSingle("left", "Style", newVal);
                }}
              >
                <SelectTrigger className={cn(styles.contentInput, "w-[80px]")}>
                  <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent className="border-none bg-white">
                  <SelectItem value="__none__" className={styles.contentSelect}>
                    None
                  </SelectItem>
                  {BORDER_STYLES.filter((s) => s !== "none").map((s) => (
                    <SelectItem key={s} value={s} className={styles.contentSelect}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-full !h-[26px] bg-[var(--color-primary)] text-white"
              onClick={() => setLeftRightLinked(!leftRightLinked)}
              title={leftRightLinked ? "Unlink" : "Link"}
            >
              {leftRightLinked ? <LinkSimpleIcon size={10} /> : <LinkBreakIcon size={10} />}
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <FieldRow label="Radius">
          <div className="flex items-center gap-1">
            <UnitInput
              value={allRadius}
              onChange={(val) => updateAllRadius(val)}
              placeholder="0"
              className={cn(styles.contentInput, "flex-1")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="!w-4 !h-4"
              onClick={() => setRadiusExpanded(!radiusExpanded)}
            >
              {radiusExpanded ? <SelectionIcon size={12} /> : <SelectionAllIcon size={12} />}
            </Button>
          </div>
        </FieldRow>

        {radiusExpanded && (
          <div className="space-y-1">
            {/* Hàng Top Left / Top Right */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[var(--color-dark)]/40 uppercase w-4">TL</span>
              <UnitInput
                value={radiusValues.TopLeft}
                onChange={(val) => {
                  updateSingleRadius("TopLeft", val);
                  if (topRadiusLinked) updateSingleRadius("TopRight", val);
                }}
                placeholder="0"
                className={cn(styles.contentInput, "flex-1")}
              />
              <span className="text-[10px] text-[var(--color-dark)]/40 uppercase w-4">TR</span>
              <UnitInput
                value={radiusValues.TopRight}
                onChange={(val) => {
                  updateSingleRadius("TopRight", val);
                  if (topRadiusLinked) updateSingleRadius("TopLeft", val);
                }}
                placeholder="0"
                className={cn(styles.contentInput, "flex-1")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="!w-4 !h-4"
                onClick={() => setTopRadiusLinked(!topRadiusLinked)}
                title={topRadiusLinked ? "Unlink" : "Link"}
              >
                {topRadiusLinked ? <LinkSimpleIcon size={10} /> : <LinkBreakIcon size={10} />}
              </Button>
            </div>
            {/* Hàng Bottom Left / Bottom Right */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[var(--color-dark)]/40 uppercase w-4">BL</span>
              <UnitInput
                value={radiusValues.BottomLeft}
                onChange={(val) => {
                  updateSingleRadius("BottomLeft", val);
                  if (bottomRadiusLinked) updateSingleRadius("BottomRight", val);
                }}
                placeholder="0"
                className={cn(styles.contentInput, "flex-1")}
              />
              <span className="text-[10px] text-[var(--color-dark)]/40 uppercase w-4">BR</span>
              <UnitInput
                value={radiusValues.BottomRight}
                onChange={(val) => {
                  updateSingleRadius("BottomRight", val);
                  if (bottomRadiusLinked) updateSingleRadius("BottomLeft", val);
                }}
                placeholder="0"
                className={cn(styles.contentInput, "flex-1")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="!w-4 !h-4"
                onClick={() => setBottomRadiusLinked(!bottomRadiusLinked)}
                title={bottomRadiusLinked ? "Unlink" : "Link"}
              >
                {bottomRadiusLinked ? <LinkSimpleIcon size={10} /> : <LinkBreakIcon size={10} />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(BorderPanel);
