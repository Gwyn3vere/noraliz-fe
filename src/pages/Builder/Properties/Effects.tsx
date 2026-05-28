import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@phosphor-icons/react";
import FieldRow from "../Content/FieldRow";
import { UnitInput } from "@/components/shared/UnitInput";
import ColorPickerField from "@/components/shared/ColorPickerField";
import { useStyleUpdater } from "@/components/hooks/useStyleUpdater";
import { contentStyles as styles } from "../Content/Content.styles";
import { cn } from "@/lib/utils";
import {
  MIX_BLEND_MODES,
  FILTER_UNITS,
  AVAILABLE_FILTERS,
  BOX_SHADOW_PRESETS,
  type ShadowType,
} from "@/constants/effects";
import { parseBoxShadow, buildBoxShadow } from "@/helper/effectsHelper";

function Effects() {
  const { currentStyles, updateStyles } = useStyleUpdater();
  const [filterOpen, setFilterOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const [filterDropUp, setFilterDropUp] = useState(false);

  useEffect(() => {
    if (filterOpen && filterButtonRef.current) {
      const rect = filterButtonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setFilterDropUp(spaceBelow < 200);
    }
  }, [filterOpen]);

  const opacity = currentStyles.opacity || "1";
  const mixBlendMode = currentStyles.mixBlendMode || "normal";
  const [filterList, setFilterList] = useState<string[]>(() => {
    const raw = currentStyles.filter || "";
    if (!raw) return [];
    const names = raw.match(/(\w+)\(/g);
    return names ? names.map((n: string) => n.replace("(", "")) : [];
  });
  const filterValues = useMemo(() => {
    const raw = currentStyles.filter || "";
    const map: Record<string, string> = {};
    for (const name of filterList) {
      const regex = new RegExp(`${name}\\(([^)]+)\\)`);
      const match = raw.match(regex);
      map[name] = match ? match[1] : "";
    }
    return map;
  }, [currentStyles.filter, filterList]);

  const updateFilter = useCallback(
    (name: string, value: string) => {
      const newValues = { ...filterValues, [name]: value };
      const parts = filterList
        .map((f) => {
          const v = newValues[f];
          if (!v) return "";
          return `${f}(${v})`;
        })
        .filter(Boolean)
        .join(" ");
      updateStyles({ filter: parts || undefined });
    },
    [filterList, filterValues, updateStyles],
  );
  const addFilter = useCallback(
    (name: string) => {
      if (!filterList.includes(name)) {
        const newList = [...filterList, name];
        setFilterList(newList);
        // Tự động set giá trị mặc định
        const defaults: Record<string, string> = {
          blur: "0px",
          brightness: "1",
          contrast: "1",
          grayscale: "0",
          "hue-rotate": "0deg",
          invert: "0",
          saturate: "1",
          sepia: "0",
        };
        const newValue = defaults[name] || "";
        const parts = newList
          .map((f) => {
            if (f === name) return `${name}(${newValue})`;
            const v = filterValues[f] || defaults[f] || "";
            return v ? `${f}(${v})` : "";
          })
          .filter(Boolean)
          .join(" ");
        updateStyles({ filter: parts || undefined });
      }
    },
    [filterList, filterValues, updateStyles],
  );
  const removeFilter = useCallback(
    (name: string) => {
      const newList = filterList.filter((f) => f !== name);
      setFilterList(newList);
      const parts = newList
        .map((f) => {
          const v = filterValues[f];
          return v ? `${f}(${v})` : "";
        })
        .filter(Boolean)
        .join(" ");
      updateStyles({ filter: parts || undefined });
    },
    [filterList, filterValues, updateStyles],
  );

  const boxShadowRaw = currentStyles.boxShadow || "none";

  const parsedBox = useMemo(() => {
    return parseBoxShadow(boxShadowRaw);
  }, [boxShadowRaw]);

  const updateBoxShadow = useCallback(
    (partial: Partial<ReturnType<typeof parseBoxShadow>>) => {
      let newVal = { ...parsedBox, ...partial };

      if (newVal.type !== "none") {
        newVal = {
          ...newVal,
          x: newVal.x || "0px",
          y: newVal.y || "0px",
          blur: newVal.blur || "0px",
          spread: newVal.spread || "0px",
          color: newVal.color || "#000000",
        };
      }
      const shadowType: ShadowType = BOX_SHADOW_PRESETS.includes(newVal.type as ShadowType)
        ? (newVal.type as ShadowType)
        : "outside";
      const shadow = buildBoxShadow(shadowType, newVal.x, newVal.y, newVal.blur, newVal.spread, newVal.color);
      updateStyles({ boxShadow: shadow === "none" ? undefined : shadow });
    },
    [parsedBox, updateStyles],
  );

  return (
    <div className="space-y-4">
      {/* Opacity */}
      <FieldRow label="Opacity">
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => updateStyles({ opacity: e.target.value })}
            className="flex-1 h-1 accent-[var(--color-primary)]"
          />
          <span className="text-[11px] text-[var(--color-dark)]/60 w-10 text-right">
            {Math.round(parseFloat(opacity) * 100)}%
          </span>
        </div>
      </FieldRow>

      {/* Mix Blend Mode */}
      <FieldRow label="Blending">
        <Select value={mixBlendMode} onValueChange={(val) => updateStyles({ mixBlendMode: val })}>
          <SelectTrigger className={styles.contentInput}>
            <SelectValue placeholder="normal" />
          </SelectTrigger>
          <SelectContent className="border-none bg-white max-h-[200px]">
            {MIX_BLEND_MODES.map((mode) => (
              <SelectItem key={mode} value={mode} className={styles.contentSelect}>
                {mode}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldRow>

      {/* Filter */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-medium text-[var(--color-dark)]/50 uppercase">Filter</span>
          <Button
            ref={filterButtonRef}
            type="button"
            variant="ghost"
            size="icon"
            className="!w-auto !h-[26px] bg-[var(--color-primary)] text-[12px] text-white px-2"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            Add
          </Button>
        </div>

        {/* Dropdown qua Portal */}
        {filterOpen &&
          createPortal(
            <div
              className="fixed z-[9999] w-32 bg-white border border-[var(--color-dark)]/10 rounded-md shadow-lg"
              style={{
                top: filterDropUp
                  ? (filterButtonRef.current?.getBoundingClientRect().top ?? 0) - 160
                  : (filterButtonRef.current?.getBoundingClientRect().bottom ?? 0) + 4,
                left: (filterButtonRef.current?.getBoundingClientRect().left ?? 0) - 100,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {AVAILABLE_FILTERS.map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    addFilter(name);
                    setFilterOpen(false);
                  }}
                  className="block w-full text-left px-3 py-1.5 text-[11px] hover:bg-[var(--color-primary)]/10"
                >
                  {name}
                </button>
              ))}
            </div>,
            document.body,
          )}

        {/* Đóng khi click ra ngoài */}
        {filterOpen && <div className="fixed inset-0 z-[9998]" onClick={() => setFilterOpen(false)} />}

        {filterList.length > 0 && (
          <div className="space-y-2">
            {filterList.map((name) => (
              <div key={name} className="flex items-center gap-1">
                <span className="text-[12px] text-[var(--color-dark)]/50 w-16 uppercase">{name}</span>
                <UnitInput
                  value={filterValues[name] || ""}
                  onChange={(val) => updateFilter(name, val)}
                  placeholder="0"
                  className={cn(styles.contentInput, "flex-1 h-[26px] text-[11px]")}
                  units={FILTER_UNITS[name] || ["px", "%"]}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="!w-4 !h-4"
                  onClick={() => removeFilter(name)}
                >
                  <TrashIcon size={10} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Box Shadow */}
      <div>
        <span className="text-[11px] font-medium text-[var(--color-dark)]/50 uppercase">Box Shadow</span>
        <div className="flex items-center gap-1 mt-1">
          {BOX_SHADOW_PRESETS.map((type) => (
            <Button
              key={type}
              type="button"
              className={cn(
                "flex-1 h-[26px] text-[10px] font-medium uppercase z-10 relative",
                parsedBox.type === type
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-primary)]/10 text-[var(--color-dark)] hover:bg-[var(--color-primary)]/20",
              )}
              style={{ pointerEvents: "auto" }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                updateBoxShadow({ type });
              }}
            >
              {type}
            </Button>
          ))}
        </div>

        {parsedBox.type !== "none" && (
          <div className="space-y-2 mt-2">
            <div className="grid grid-cols-2 gap-2">
              <FieldRow label="X">
                <UnitInput
                  value={parsedBox.x}
                  onChange={(val) => updateBoxShadow({ x: val })}
                  placeholder="0"
                  className={styles.contentInput}
                />
              </FieldRow>
              <FieldRow label="Y">
                <UnitInput
                  value={parsedBox.y}
                  onChange={(val) => updateBoxShadow({ y: val })}
                  placeholder="0"
                  className={styles.contentInput}
                />
              </FieldRow>
              <FieldRow label="Blur">
                <UnitInput
                  value={parsedBox.blur}
                  onChange={(val) => updateBoxShadow({ blur: val })}
                  placeholder="0"
                  className={styles.contentInput}
                />
              </FieldRow>
              <FieldRow label="Spread">
                <UnitInput
                  value={parsedBox.spread}
                  onChange={(val) => updateBoxShadow({ spread: val })}
                  placeholder="0"
                  className={styles.contentInput}
                />
              </FieldRow>
            </div>
            <FieldRow label="Color">
              <ColorPickerField
                value={parsedBox.color || "transparent"}
                onChange={(color) => updateBoxShadow({ color })}
              />
            </FieldRow>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(Effects);
