import React, { useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import FieldRow from "../Content/FieldRow";
import { useStyleUpdater } from "@/components/hooks/useStyleUpdater";
import { contentStyles as styles } from "../Content/Content.styles";

const DISPLAYS = ["block", "inline", "inline-block", "flex", "inline-flex", "grid", "inline-grid", "none"];
const FLEX_DIRECTIONS = ["row", "row-reverse", "column", "column-reverse"];
const JUSTIFY_CONTENTS = ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"];
const ALIGN_ITEMS = ["stretch", "flex-start", "center", "flex-end", "baseline"];
const FLEX_WRAPS = ["nowrap", "wrap", "wrap-reverse"];

const DISPLAY_CLEANUP: Record<string, string[]> = {
  flex: ["gridTemplateColumns", "gridTemplateRows", "gridColumn", "gridRow", "justifyItems", "alignContent"],
  grid: [
    "flexDirection",
    "flexWrap",
    "justifyContent",
    "alignItems",
    "alignSelf",
    "flexBasis",
    "flexGrow",
    "flexShrink",
  ],
  block: ["flexDirection", "flexWrap", "justifyContent", "alignItems", "gridTemplateColumns", "gridTemplateRows"],
  inline: ["flexDirection", "flexWrap", "justifyContent", "alignItems", "gridTemplateColumns", "gridTemplateRows"],
  "inline-block": [
    "flexDirection",
    "flexWrap",
    "justifyContent",
    "alignItems",
    "gridTemplateColumns",
    "gridTemplateRows",
  ],
  "inline-flex": ["gridTemplateColumns", "gridTemplateRows", "gridColumn", "gridRow"],
  "inline-grid": ["flexDirection", "flexWrap", "justifyContent", "alignItems"],
  none: ["display"],
};

function Layout() {
  const { currentStyles, updateStyles } = useStyleUpdater();

  const displayValue = currentStyles.display || "block";
  const isFlex = displayValue.startsWith("flex");
  const isGrid = displayValue.startsWith("grid");

  const handleDisplayChange = useCallback(
    (val: string) => {
      const propsToRemove = DISPLAY_CLEANUP[val] || [];
      const removeStyles = Object.fromEntries(propsToRemove.map((p) => [p, undefined]));
      updateStyles({ display: val, ...removeStyles });
    },
    [updateStyles],
  );

  return (
    <div className="space-y-3">
      <FieldRow label="Display">
        <Select value={displayValue} onValueChange={handleDisplayChange}>
          <SelectTrigger className={styles.contentInput}>
            <SelectValue placeholder="Display" />
          </SelectTrigger>
          <SelectContent className="border-none bg-white">
            {DISPLAYS.map((d) => (
              <SelectItem key={d} value={d} className={styles.contentSelect}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>

      {isFlex && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <FieldRow label="Direction">
              <Select
                value={currentStyles.flexDirection || "row"}
                onValueChange={(val) => updateStyles({ flexDirection: val })}
              >
                <SelectTrigger className={styles.contentInput}>
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent className="border-none bg-white">
                  {FLEX_DIRECTIONS.map((d) => (
                    <SelectItem key={d} value={d} className={styles.contentSelect}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldRow>
            <FieldRow label="Justify Content">
              <Select
                value={currentStyles.justifyContent || "flex-start"}
                onValueChange={(val) => updateStyles({ justifyContent: val })}
              >
                <SelectTrigger className={styles.contentInput}>
                  <SelectValue placeholder="Justify Content" />
                </SelectTrigger>
                <SelectContent className="border-none bg-white">
                  {JUSTIFY_CONTENTS.map((j) => (
                    <SelectItem key={j} value={j} className={styles.contentSelect}>
                      {j}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldRow>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FieldRow label="Align Items">
              <Select
                value={currentStyles.alignItems || "stretch"}
                onValueChange={(val) => updateStyles({ alignItems: val })}
              >
                <SelectTrigger className={styles.contentInput}>
                  <SelectValue placeholder="Align Items" />
                </SelectTrigger>
                <SelectContent className="border-none bg-white">
                  {ALIGN_ITEMS.map((a) => (
                    <SelectItem key={a} value={a} className={styles.contentSelect}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldRow>
            <FieldRow label="Wrap">
              <Select
                value={currentStyles.flexWrap || "nowrap"}
                onValueChange={(val) => updateStyles({ flexWrap: val })}
              >
                <SelectTrigger className={styles.contentInput}>
                  <SelectValue placeholder="Wrap" />
                </SelectTrigger>
                <SelectContent className="border-none bg-white">
                  {FLEX_WRAPS.map((w) => (
                    <SelectItem key={w} value={w} className={styles.contentSelect}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldRow>
          </div>
          <FieldRow label="Gap">
            <Input
              type="number"
              value={currentStyles.gap ? parseInt(currentStyles.gap, 10) : ""}
              placeholder="px"
              className={styles.contentInput}
              onChange={(e) => updateStyles({ gap: `${e.target.value}px` })}
            />
          </FieldRow>
        </>
      )}

      {isGrid && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <FieldRow label="Columns">
              <Select
                value={
                  currentStyles.gridTemplateColumns
                    ? (() => {
                        const match = currentStyles.gridTemplateColumns.match(/repeat\((\d+),\s*1fr\)/);
                        if (match) {
                          const cols = match[1];
                          return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(parseInt(cols)) ? cols : "custom";
                        }
                        return "1";
                      })()
                    : "1"
                }
                onValueChange={(val) => {
                  if (val === "custom") {
                    const currentCols = currentStyles.gridTemplateColumns?.match(/repeat\((\d+),\s*1fr\)/)?.[1] || "1";
                    updateStyles({ gridTemplateColumns: `repeat(${currentCols}, 1fr)` });
                  } else {
                    const cols = parseInt(val);
                    updateStyles({ gridTemplateColumns: `repeat(${cols}, 1fr)` });
                  }
                }}
              >
                <SelectTrigger className={styles.contentInput}>
                  <SelectValue placeholder="1" />
                </SelectTrigger>
                <SelectContent className="border-none bg-white">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                    <SelectItem key={n} value={n.toString()} className={styles.contentSelect}>
                      {n} {n === 1 ? "Column" : "Columns"}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom" className={styles.contentSelect}>
                    Custom...
                  </SelectItem>
                </SelectContent>
              </Select>
              {/* Input hiển thị khi chọn Custom */}
              {(() => {
                const match = currentStyles.gridTemplateColumns?.match(/repeat\((\d+),\s*1fr\)/);
                const currentCols = match ? match[1] : "1";
                const selectValue = match
                  ? ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].includes(match[1])
                    ? match[1]
                    : "custom"
                  : "1";
                return selectValue === "custom" ? (
                  <Input
                    type="number"
                    min={1}
                    value={currentCols}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      updateStyles({ gridTemplateColumns: `repeat(${val}, 1fr)` });
                    }}
                    className={styles.contentInput}
                    placeholder="Columns"
                  />
                ) : null;
              })()}
            </FieldRow>
            <FieldRow label="Rows">
              <Select
                value={
                  currentStyles.gridTemplateRows
                    ? (() => {
                        const match = currentStyles.gridTemplateRows.match(/repeat\((\d+),\s*1fr\)/);
                        if (match) {
                          const rows = match[1];
                          return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(parseInt(rows)) ? rows : "custom";
                        }
                        return "1";
                      })()
                    : "1"
                }
                onValueChange={(val) => {
                  if (val === "custom") {
                    const currentRows = currentStyles.gridTemplateRows?.match(/repeat\((\d+),\s*1fr\)/)?.[1] || "1";
                    updateStyles({ gridTemplateRows: `repeat(${currentRows}, 1fr)` });
                  } else {
                    const rows = parseInt(val);
                    updateStyles({ gridTemplateRows: `repeat(${rows}, 1fr)` });
                  }
                }}
              >
                <SelectTrigger className={styles.contentInput}>
                  <SelectValue placeholder="1" />
                </SelectTrigger>
                <SelectContent className="border-none bg-white">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                    <SelectItem key={n} value={n.toString()} className={styles.contentSelect}>
                      {n} {n === 1 ? "Row" : "Rows"}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom" className={styles.contentSelect}>
                    Custom...
                  </SelectItem>
                </SelectContent>
              </Select>
              {/* Input hiển thị khi chọn Custom */}
              {(() => {
                const match = currentStyles.gridTemplateRows?.match(/repeat\((\d+),\s*1fr\)/);
                const currentRows = match ? match[1] : "1";
                const selectValue = match
                  ? ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].includes(match[1])
                    ? match[1]
                    : "custom"
                  : "1";
                return selectValue === "custom" ? (
                  <Input
                    type="number"
                    min={1}
                    value={currentRows}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      updateStyles({ gridTemplateRows: `repeat(${val}, 1fr)` });
                    }}
                    className={styles.contentInput}
                    placeholder="Rows"
                  />
                ) : null;
              })()}
            </FieldRow>
          </div>
          <FieldRow label="Gap">
            <Input
              type="number"
              value={currentStyles.gap ? parseInt(currentStyles.gap, 10) : ""}
              placeholder="px"
              className={styles.contentInput}
              onChange={(e) => updateStyles({ gap: `${e.target.value}px` })}
            />
          </FieldRow>
        </>
      )}
    </div>
  );
}

export default React.memo(Layout);
