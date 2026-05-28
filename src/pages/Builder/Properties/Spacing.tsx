import React, { useCallback, useMemo } from "react";
import { SpacingGroup } from "../Properties/SpacingGroup";
import { useStyleUpdater } from "@/components/hooks/useStyleUpdater";

type Side = "top" | "right" | "bottom" | "left";
const SIDES: Side[] = ["top", "right", "bottom", "left"];
function parsePixelValue(val: string | undefined): number | "" {
  if (!val) return "";
  const num = parseInt(val, 10);
  return isNaN(num) ? "" : num;
}

function parseSpacingValues(
  currentStyles: Record<string, any>,
  prefix: "margin" | "padding",
): Record<Side, number | ""> {
  const shorthand = currentStyles[prefix];
  if (shorthand && typeof shorthand === "string") {
    const parts = shorthand.trim().split(/\s+/);
    const values: (number | "")[] = [];
    for (const part of parts) {
      const num = parsePixelValue(part);
      values.push(num);
    }
    const result: Record<Side, number | ""> = {} as any;
    if (values.length === 1) {
      result.top = result.right = result.bottom = result.left = values[0];
    } else if (values.length === 2) {
      result.top = result.bottom = values[0];
      result.right = result.left = values[1];
    } else if (values.length === 3) {
      result.top = values[0];
      result.right = result.left = values[1];
      result.bottom = values[2];
    } else if (values.length === 4) {
      result.top = values[0];
      result.right = values[1];
      result.bottom = values[2];
      result.left = values[3];
    } else {
      // fallback
      result.top = result.right = result.bottom = result.left = "";
    }
    return result;
  }

  // Đọc từ các thuộc tính riêng lẻ
  return {
    top: parsePixelValue(currentStyles[`${prefix}Top`]),
    right: parsePixelValue(currentStyles[`${prefix}Right`]),
    bottom: parsePixelValue(currentStyles[`${prefix}Bottom`]),
    left: parsePixelValue(currentStyles[`${prefix}Left`]),
  };
}

function Spacing() {
  const { currentStyles, updateStyles } = useStyleUpdater();

  const marginValues = useMemo(() => parseSpacingValues(currentStyles, "margin"), [currentStyles]);
  const paddingValues = useMemo(() => parseSpacingValues(currentStyles, "padding"), [currentStyles]);

  const updateAll = useCallback(
    (prefix: "margin" | "padding", value: string) => {
      const num = value === "" ? "" : parseInt(value, 10);
      const updates: Record<string, any> = {};
      SIDES.forEach((s) => {
        updates[`${prefix}${s.charAt(0).toUpperCase() + s.slice(1)}`] = num !== "" ? `${num}px` : "";
      });
      updates[prefix] = undefined; // xóa shorthand
      updateStyles(updates);
    },
    [updateStyles],
  );

  const updateSingle = useCallback(
    (prefix: "margin" | "padding", side: Side, value: string) => {
      const num = value === "" ? "" : parseInt(value, 10);
      const updates: Record<string, any> = {};
      updates[`${prefix}${side.charAt(0).toUpperCase() + side.slice(1)}`] = num !== "" ? `${num}px` : "";
      updates[prefix] = undefined; // xóa shorthand
      updateStyles(updates);
    },
    [updateStyles],
  );

  return (
    <div className="space-y-4">
      <SpacingGroup
        label="Margin"
        values={marginValues}
        onUpdateAll={(val) => updateAll("margin", val)}
        onUpdateSingle={(side, val) => updateSingle("margin", side, val)}
      />
      <SpacingGroup
        label="Padding"
        values={paddingValues}
        onUpdateAll={(val) => updateAll("padding", val)}
        onUpdateSingle={(side, val) => updateSingle("padding", side, val)}
      />
    </div>
  );
}

export default React.memo(Spacing);
