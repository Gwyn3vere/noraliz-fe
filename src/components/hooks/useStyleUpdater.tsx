import { useCallback, useMemo } from "react";
import { useEditorStore } from "@/stores/editorStore";
import { useSelectedElement } from "@/components/hooks/useSelectedElement";

export function useStyleUpdater() {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const updateSection = useEditorStore((s) => s.updateSection);
  const { selectedBlock, selectedSection, selectionType } = useSelectedElement();

  const element = selectedBlock ?? selectedSection;
  const elementId = element?.id;
  const isBlock = selectionType === "block";
  const isSection = selectionType === "section";

  const currentStyles = useMemo(() => (element as any)?.props?.styles ?? {}, [element]);

  const updateStyles = useCallback(
    (newStyles: Record<string, string | undefined>) => {
      if (!elementId) return;
      const updater = (el: any) => ({
        ...el,
        props: {
          ...el.props,
          styles: {
            ...(el.props?.styles ?? {}),
            ...newStyles,
          },
        },
      });
      if (isBlock) updateBlock(elementId, updater);
      else if (isSection) updateSection(elementId, updater);
    },
    [elementId, isBlock, isSection, updateBlock, updateSection],
  );

  return { currentStyles, updateStyles };
}
