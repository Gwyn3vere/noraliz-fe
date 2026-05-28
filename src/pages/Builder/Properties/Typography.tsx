import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FontFamilySelect from "@/components/shared/FontFamilySelect";
import ColorPickerField from "@/components/shared/ColorPickerField";
import { TextShadowEditor } from "./TextShadowEditor";
import { useTypographyEditor } from "@/components/hooks/useTypographyEditor";
import FieldRow from "../Content/FieldRow";
import { contentStyles as styles } from "../Content/Content.styles";
import { cn } from "@/lib/utils";
import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
  ArrowsInLineVerticalIcon,
  ArrowLineUpIcon,
  ArrowLineDownIcon,
} from "@phosphor-icons/react";

const FONT_WEIGHTS = ["100", "200", "300", "400", "500", "600", "700", "800", "900"];

const TEXT_DECORATIONS = [
  { property: "fontStyle", value: "italic", fallback: "normal", label: "I", className: "font-serif italic" },
  { property: "textDecoration", value: "underline", fallback: "none", label: "U", className: "underline" },
  { property: "textDecoration", value: "overline", fallback: "none", label: "O", className: "overline" },
  { property: "textDecoration", value: "line-through", fallback: "none", label: "S", className: "line-through" },
];

const TEXT_TRANSFORMS = [
  { property: "textTransform", value: "uppercase", fallback: "none", label: "AA" },
  { property: "textTransform", value: "lowercase", fallback: "none", label: "aa" },
  { property: "textTransform", value: "capitalize", fallback: "none", label: "Aa" },
];

const TEXT_ALIGNMENT = [
  { property: "textAlign", value: "left", fallback: "none", label: TextAlignLeftIcon },
  { property: "textAlign", value: "center", fallback: "none", label: TextAlignCenterIcon },
  { property: "textAlign", value: "right", fallback: "none", label: TextAlignRightIcon },
  { property: "textAlign", value: "justify", fallback: "none", label: TextAlignJustifyIcon },
];

const VERTICAL_ALIGN = [
  { property: "verticalAlign", value: "top", fallback: "baseline", label: ArrowLineUpIcon },
  { property: "verticalAlign", value: "middle", fallback: "baseline", label: ArrowsInLineVerticalIcon },
  { property: "verticalAlign", value: "bottom", fallback: "baseline", label: ArrowLineDownIcon },
];

function Typography() {
  const {
    currentStyles,
    displayedFonts,
    loading,
    error,
    hasMore,
    isInlineDisplay,
    loadMore,
    loadFont,
    loadedSetRef,
    toggleStyle,
    isActive,
    handleFontChange,
    handleFontWeightChange,
    handleFontSizeChange,
    handleLineHeightChange,
    handleLetterSpacingChange,
    handleColorChange,
    handleTextIndentChange,
    handleWordSpacingChange,
    handleWhiteSpaceChange,
    handleTextOverflowChange,
    handleTextShadowChange,
    textIndentValue,
    wordSpacingValue,
    fontSizeValue,
    lineHeightValue,
    letterSpacingValue,
  } = useTypographyEditor();

  return (
    <div className="space-y-4">
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
            value={fontSizeValue}
            placeholder="Size"
            className={cn(styles.contentInput)}
            onChange={handleFontSizeChange}
          />
        </div>

        <div className="flex items-center justify-between">
          {TEXT_DECORATIONS.map((dec) => (
            <Button
              key={dec.value}
              type="button"
              className={cn(
                "w-[26px] h-[26px]",
                dec.className,
                isActive(dec.property, dec.value)
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-primary)]/10 text-[var(--color-dark)] hover:bg-[var(--color-primary)]/20",
              )}
              onClick={() => toggleStyle(dec.property, dec.value, dec.fallback)}
            >
              <span className={dec.className}>{dec.label}</span>
            </Button>
          ))}
          {TEXT_TRANSFORMS.map((trans) => (
            <Button
              key={trans.value}
              type="button"
              className={cn(
                "w-[26px] h-[26px] text-xs font-medium",
                isActive(trans.property, trans.value)
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-primary)]/10 text-[var(--color-dark)] hover:bg-[var(--color-primary)]/20",
              )}
              onClick={() => toggleStyle(trans.property, trans.value, trans.fallback)}
            >
              {trans.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <FieldRow label="Line height">
          <Input
            type="number"
            value={lineHeightValue}
            className={cn(styles.contentInput)}
            onChange={handleLineHeightChange}
          />
        </FieldRow>

        <FieldRow label="Letter spacing">
          <Input
            type="number"
            value={letterSpacingValue}
            placeholder="px"
            className={cn(styles.contentInput)}
            onChange={handleLetterSpacingChange}
          />
        </FieldRow>
      </div>

      <div className="relative space-y-2">
        <FieldRow label="Color">
          <ColorPickerField value={currentStyles.color || "#000000"} onChange={handleColorChange} />
        </FieldRow>

        <div>
          <div className="flex items-center justify-between">
            {TEXT_ALIGNMENT.map((align) => {
              const Icon = align.label;
              return (
                <Button
                  key={align.value}
                  type="button"
                  className={cn(
                    "w-[26px] h-[26px]",
                    isActive(align.property, align.value)
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-primary)]/10 text-[var(--color-dark)] hover:bg-[var(--color-primary)]/20",
                  )}
                  onClick={() => toggleStyle(align.property, align.value, align.fallback)}
                >
                  <Icon />
                </Button>
              );
            })}

            {VERTICAL_ALIGN.map((valign) => {
              const Icon = valign.label;
              return (
                <Button
                  key={valign.value}
                  type="button"
                  disabled={!isInlineDisplay}
                  className={cn(
                    "w-[26px] h-[26px]",
                    !isInlineDisplay
                      ? "opacity-30 cursor-not-allowed bg-[var(--color-dark)]/30"
                      : isActive("verticalAlign", valign.value)
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-primary)]/10 text-[var(--color-dark)] hover:bg-[var(--color-primary)]/20",
                  )}
                  onClick={() => toggleStyle(valign.property, valign.value, valign.fallback)}
                >
                  <Icon weight="fill" />
                </Button>
              );
            })}
          </div>

          {!isInlineDisplay && (
            <p className="text-[10px] text-[var(--color-dark)]/50 mt-1 text-right">
              Set display to inline‑block to enable vertical align
            </p>
          )}
        </div>
      </div>

      <FieldRow label="Text format">
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            value={textIndentValue}
            placeholder="Indent (px)"
            className={cn(styles.contentInput)}
            onChange={handleTextIndentChange}
          />
          <Input
            type="number"
            value={wordSpacingValue}
            placeholder="Word spacing (px)"
            className={cn(styles.contentInput)}
            onChange={handleWordSpacingChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Select value={currentStyles.whiteSpace || "normal"} onValueChange={handleWhiteSpaceChange}>
            <SelectTrigger className={cn(styles.contentInput)}>
              <SelectValue placeholder="White space" />
            </SelectTrigger>
            <SelectContent className="border-none bg-white">
              {["normal", "nowrap", "pre", "pre-wrap", "pre-line", "break-spaces"].map((v) => (
                <SelectItem key={v} value={v} className={styles.contentSelect}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={currentStyles.textOverflow || "clip"} onValueChange={handleTextOverflowChange}>
            <SelectTrigger className={cn(styles.contentInput)}>
              <SelectValue placeholder="Text overflow" />
            </SelectTrigger>
            <SelectContent className="border-none bg-white">
              {["clip", "ellipsis"].map((v) => (
                <SelectItem key={v} value={v} className={styles.contentSelect}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FieldRow>

      <FieldRow label="Text Shadow">
        <TextShadowEditor value={currentStyles.textShadow || "none"} onChange={handleTextShadowChange} />
      </FieldRow>
    </div>
  );
}

export default React.memo(Typography);
