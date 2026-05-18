import { useMemo } from "react";
import { useEditorStore } from "@/stores/editorStore";
import type { ColumnBlock, ColumnsBlock, Block, Section } from "@/types";

export function useSelectedElement() {
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectedSectionId = useEditorStore((s) => s.selectedSectionId);
  const selectedColumnId = useEditorStore((s) => s.selectedColumnId);
  const selectedColumnSectionId = useEditorStore((s) => s.selectedColumnSectionId);
  const currentProject = useEditorStore((s) => s.currentProject);
  const currentPageId = useEditorStore((s) => s.currentPageId);

  const currentPage = currentProject?.pages.find((p) => p.id === currentPageId);

  const selectedBlock = useMemo((): Block | null => {
    if (!selectedBlockId || !currentPage) return null;
    for (const section of currentPage.sections) {
      for (const block of section.blocks) {
        if (block.id === selectedBlockId) return block;
        if (block.type === "columns") {
          const colsBlock = block as ColumnsBlock;
          for (const col of colsBlock.children) {
            const found = col.blocks.find((b) => b.id === selectedBlockId);
            if (found) return found;
          }
        }
      }
    }
    return null;
  }, [selectedBlockId, currentPage]);

  const selectedSection = useMemo((): Section | null => {
    if (!selectedSectionId || !currentPage) return null;
    return currentPage.sections.find((s) => s.id === selectedSectionId) ?? null;
  }, [selectedSectionId, currentPage]);

  const selectedColumn = useMemo((): ColumnBlock | null => {
    if (!selectedColumnId || !selectedColumnSectionId || !currentPage) return null;
    const section = currentPage.sections.find((s) => s.id === selectedColumnSectionId);
    if (!section) return null;
    for (const block of section.blocks) {
      if (block.type === "columns") {
        const col = (block as ColumnsBlock).children.find((c) => c.id === selectedColumnId);
        if (col) return col;
      }
    }
    return null;
  }, [selectedColumnId, selectedColumnSectionId, currentPage]);

  // Xác định loại element đang được chọn
  const selectionType: "block" | "section" | "column" | null = selectedBlock
    ? "block"
    : selectedSection
      ? "section"
      : selectedColumn
        ? "column"
        : null;

  return { selectedBlock, selectedSection, selectedColumnSectionId, selectedColumn, selectionType };
}
