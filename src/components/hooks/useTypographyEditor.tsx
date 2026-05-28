import { useCallback, useMemo } from "react";
import { useFontManager } from "@/components/hooks/useFontManager";
import { useTypographyStyles } from "./useTypographyStyles";
import { useStyleUpdater } from "./useStyleUpdater";

export function useTypographyEditor() {
  const { currentStyles, updateStyles } = useStyleUpdater();
  const { displayedFonts, loading, error, hasMore, loadMore, loadFont, loadedSetRef } = useFontManager();

  const isInlineDisplay = useMemo(() => {
    const display = currentStyles.display || "block";
    return ["inline", "inline-block", "table-cell"].includes(display);
  }, [currentStyles.display]);

  const { toggleStyle, isActive } = useTypographyStyles(currentStyles, updateStyles);

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

  const handleLineHeightChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value) updateStyles({ lineHeight: value });
    },
    [updateStyles],
  );

  const handleLetterSpacingChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value) updateStyles({ letterSpacing: `${value}px` });
    },
    [updateStyles],
  );

  const handleTextIndentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value) updateStyles({ textIndent: `${value}px` });
    },
    [updateStyles],
  );

  const handleWordSpacingChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value) updateStyles({ wordSpacing: `${value}px` });
    },
    [updateStyles],
  );

  const handleWhiteSpaceChange = useCallback((val: string) => updateStyles({ whiteSpace: val }), [updateStyles]);

  const handleTextOverflowChange = useCallback((val: string) => updateStyles({ textOverflow: val }), [updateStyles]);

  const handleColorChange = useCallback((color: string) => updateStyles({ color }), [updateStyles]);

  const handleTextShadowChange = useCallback(
    (value: string) => {
      updateStyles({ textShadow: value });
    },
    [updateStyles],
  );

  const fontSizeValue = currentStyles.fontSize ? parseInt(currentStyles.fontSize, 10) : "";
  const lineHeightValue = currentStyles.lineHeight ? parseFloat(currentStyles.lineHeight) : "";
  const letterSpacingValue = currentStyles.letterSpacing ? parseInt(currentStyles.letterSpacing, 10) : "";
  const textIndentValue = currentStyles.textIndent ? parseInt(currentStyles.textIndent, 10) : "";
  const wordSpacingValue = currentStyles.wordSpacing ? parseInt(currentStyles.wordSpacing, 10) : "";

  return {
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
  };
}
