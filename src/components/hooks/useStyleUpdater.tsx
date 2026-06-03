import { useCallback, useMemo } from "react";
import { useEditorStore } from "@/stores/editorStore";
import { useSelectedElement } from "@/components/hooks/useSelectedElement";
import { normalizeStyles } from "@/helper/normalizeStyles";

export function useStyleUpdater() {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const updateSection = useEditorStore((s) => s.updateSection);
  const updateColumn = useEditorStore((s) => s.updateColumn);
  const activeBreakpoint = useEditorStore((s) => s.activeBreakpoint);
  const { selectedBlock, selectedSection, selectedColumn, selectedColumnSectionId, selectionType } =
    useSelectedElement();

  const element = selectionType === "column" ? selectedColumn : (selectedBlock ?? selectedSection);
  const elementId = element?.id;
  const isBlock = selectionType === "block";
  const isSection = selectionType === "section";
  const isColumn = selectionType === "column";

  const rawStyles = (element as any)?.props?.styles ?? {};
  const normalizedStyles = normalizeStyles(rawStyles);

  const currentStyles = useMemo(() => {
    const base = normalizedStyles.base || {};
    if (activeBreakpoint === "base") return base;
    if (activeBreakpoint === "tablet") return { ...base, ...(normalizedStyles.tablet ?? {}) };
    if (activeBreakpoint === "mobile")
      return { ...base, ...(normalizedStyles.tablet ?? {}), ...(normalizedStyles.mobile ?? {}) };
    return base;
  }, [normalizedStyles, activeBreakpoint]);

  const updateStyles = useCallback(
    (newStyles: Record<string, string | undefined>) => {
      if (!elementId) return;
      const breakpoint = activeBreakpoint;

      const updater = (el: any) => {
        const currentRaw = el.props?.styles ?? {};
        const normalized = normalizeStyles(currentRaw);

        return {
          ...el,
          props: {
            ...el.props,
            styles: {
              ...normalized,
              [breakpoint]: {
                ...(normalized[breakpoint] ?? {}),
                ...newStyles,
              },
            },
          },
        };
      };

      if (isColumn && selectedColumnSectionId) {
        updateColumn(selectedColumnSectionId, elementId, updater);
      } else if (isBlock) {
        updateBlock(elementId, updater);
      } else if (isSection) {
        updateSection(elementId, updater);
      }
    },
    [
      elementId,
      isBlock,
      isSection,
      isColumn,
      selectedColumnSectionId,
      activeBreakpoint,
      updateBlock,
      updateSection,
      updateColumn,
    ],
  );

  return { currentStyles, updateStyles };
}
