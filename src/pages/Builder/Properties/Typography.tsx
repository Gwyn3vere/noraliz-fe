import React, { useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FontFamilySelect from "@/components/shared/FontFamilySelect";
import FieldRow from "../Content/FieldRow";
import { useEditorStore } from "@/stores/editorStore";
import { useSelectedElement } from "@/components/hooks/useSelectedElement";
import { useFontManager } from "@/components/hooks/useFontManager";
import { contentStyles as styles } from "../Content/Content.styles";
import { cn } from "@/lib/utils";

const FONT_WEIGHTS = ["100", "200", "300", "400", "500", "600", "700", "800", "900"];

function Typography() {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const updateSection = useEditorStore((s) => s.updateSection);

  const { selectedBlock, selectedSection, selectionType } = useSelectedElement();
  const { displayedFonts, loading, error, hasMore, loadMore, loadFont, loadedSetRef } = useFontManager();

  const element = selectedBlock ?? selectedSection;
  const elementId = element?.id;
  const isBlock = selectionType === "block";
  const isSection = selectionType === "section";
  const currentStyles = useMemo(() => (element as any)?.props?.styles ?? {}, [element]);

  const updateStyles = useCallback(
    (newStyles: Record<string, string>) => {
      if (!elementId) return;

      const updater = (el: any) => ({
        ...el,
        props: {
          ...el.props,
          styles: { ...(el.props?.styles ?? {}), ...newStyles },
        },
      });

      if (isBlock) updateBlock(elementId, updater);
      else if (isSection) updateSection(elementId, updater);
    },
    [elementId, isBlock, isSection, updateBlock, updateSection],
  );
  const handleFontChange = useCallback(
    async (font: string) => {
      await loadFont(font);
      updateStyles({ fontFamily: font });
    },
    [loadFont, updateStyles],
  );
  const handleFontWeightChange = useCallback((val: string) => updateStyles({ fontWeight: val }), [updateStyles]);
  const handleFontSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value) updateStyles({ fontSize: `${e.target.value}px` });
    },
    [updateStyles],
  );

  // Toggle style helper
  const toggleStyle = useCallback(
    (property: string, value: string, fallback: string) => {
      const current = currentStyles[property];
      if (current === value || (!current && fallback === value)) {
        // Toggle off -> set to fallback
        updateStyles({ [property]: fallback });
      } else {
        // Toggle on
        updateStyles({ [property]: value });
      }
    },
    [currentStyles, updateStyles],
  );

  // Active state helper
  const isActive = useCallback(
    (property: string, value: string) => {
      const current = currentStyles[property];
      return current === value;
    },
    [currentStyles],
  );

  return (
    <div className="space-y-2">
      <FieldRow label="Font Family">
        <FontFamilySelect
          value={currentStyles.fontFamily ?? ""}
          onChange={handleFontChange}
          fonts={displayedFonts}
          loading={loading}
          error={error}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onPreview={loadFont}
          loadedSetRef={loadedSetRef}
        />
      </FieldRow>

      <div className="flex items-center gap-2">
        <Select value={currentStyles.fontWeight ?? ""} onValueChange={handleFontWeightChange}>
          <SelectTrigger className={cn(styles.contentInput)}>
            <SelectValue placeholder="Weight" />
          </SelectTrigger>
          <SelectContent className="border-none bg-white">
            {FONT_WEIGHTS.map((w) => (
              <SelectItem key={w} value={w} className={styles.contentSelect}>
                {w}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          value={currentStyles.fontSize ? parseInt(currentStyles.fontSize, 10) : ""}
          placeholder="Size"
          className={cn(styles.contentInput)}
          onChange={handleFontSizeChange}
        />
      </div>

      <div className="flex items-center justify-between">
        {/* Italic */}
        <Button
          type="button"
          className={cn(
            "w-[26px] h-[26px] font-serif italic",
            isActive("fontStyle", "italic")
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-primary)]/10 text-[var(--color-dark)] hover:bg-[var(--color-primary)]/20",
          )}
          onClick={() => toggleStyle("fontStyle", "italic", "normal")}
        >
          I
        </Button>

        {/* Underline */}
        <Button
          type="button"
          className={cn(
            "w-[26px] h-[26px]",
            isActive("textDecoration", "underline")
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-primary)]/10 text-[var(--color-dark)] hover:bg-[var(--color-primary)]/20",
          )}
          onClick={() => toggleStyle("textDecoration", "underline", "none")}
        >
          <span className="underline">U</span>
        </Button>

        {/* Overline */}
        <Button
          type="button"
          className={cn(
            "w-[26px] h-[26px]",
            isActive("textDecoration", "overline")
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-primary)]/10 text-[var(--color-dark)] hover:bg-[var(--color-primary)]/20",
          )}
          onClick={() => toggleStyle("textDecoration", "overline", "none")}
        >
          <span style={{ textDecoration: "overline" }}>O</span>
        </Button>

        {/* Line-through */}
        <Button
          type="button"
          className={cn(
            "w-[26px] h-[26px]",
            isActive("textDecoration", "line-through")
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-primary)]/10 text-[var(--color-dark)] hover:bg-[var(--color-primary)]/20",
          )}
          onClick={() => toggleStyle("textDecoration", "line-through", "none")}
        >
          <span className="line-through">S</span>
        </Button>

        {/* Uppercase */}
        <Button
          type="button"
          className={cn(
            "w-[26px] h-[26px] text-xs font-medium",
            isActive("textTransform", "uppercase")
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-primary)]/10 text-[var(--color-dark)] hover:bg-[var(--color-primary)]/20",
          )}
          onClick={() => toggleStyle("textTransform", "uppercase", "none")}
        >
          AA
        </Button>

        {/* Lowercase */}
        <Button
          type="button"
          className={cn(
            "w-[26px] h-[26px] text-xs font-medium",
            isActive("textTransform", "lowercase")
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-primary)]/10 text-[var(--color-dark)] hover:bg-[var(--color-primary)]/20",
          )}
          onClick={() => toggleStyle("textTransform", "lowercase", "none")}
        >
          aa
        </Button>

        {/* Capitalize */}
        <Button
          type="button"
          className={cn(
            "w-[26px] h-[26px] text-xs font-medium",
            isActive("textTransform", "capitalize")
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-primary)]/10 text-[var(--color-dark)] hover:bg-[var(--color-primary)]/20",
          )}
          onClick={() => toggleStyle("textTransform", "capitalize", "none")}
        >
          Aa
        </Button>
      </div>
    </div>
  );
}

export default React.memo(Typography);
