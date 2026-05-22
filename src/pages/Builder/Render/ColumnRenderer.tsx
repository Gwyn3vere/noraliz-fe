import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editorStore";
import type { ColumnsBlock } from "@/types";
import { useColumnDrop } from "@/components/hooks/useColumnDrop";
import { useColumnReorder } from "@/components/hooks/useColumnReorder";
import { useDndContext } from "@dnd-kit/core";
import { BlockRenderer } from "./BlockRenderer";

export function ColumnRenderer({
  column,
  sectionId,
  columnsBlockId,
  index,
  total,
}: {
  column: ColumnsBlock["children"][0];
  sectionId: string;
  columnsBlockId: string;
  index?: number;
  total?: number;
}) {
  const { setNodeRef, isOver } = useColumnDrop(column.id, sectionId, columnsBlockId);
  const reorderingSectionId = useEditorStore((s) => s.reorderingSectionId);
  const isReorderMode = reorderingSectionId === sectionId;
  const {
    listeners,
    attributes,
    setNodeRef: setColDragRef,
    isDragging,
  } = useColumnReorder(column.id, columnsBlockId, sectionId, !isReorderMode);

  const selectedColumnId = useEditorStore((state) => state.selectedColumnId);
  const selectColumn = useEditorStore((state) => state.selectColumn);
  const isSelected = selectedColumnId === column.id;
  const [isHovered, setIsHovered] = useState(false);

  const { active } = useDndContext();
  const isDraggingColumns = active?.data.current?.blockType === "columns";

  const columnStyles: React.CSSProperties = {
    flex: "1",
    ...(column as any).props?.styles,
  };

  const showOutline = isHovered || isSelected;
  const editorClasses = cn(
    "relative flex-1 p-4 transition-all outline outline-2 outline-dashed",
    showOutline ? "outline-[var(--color-primary)]" : "outline-transparent",
    isSelected ? "before:absolute before:inset-0 before:bg-[var(--color-primary)]/5 before:pointer-events-none" : "",
    isOver ? "bg-[var(--color-primary)]/10" : "",
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectColumn(column.id, sectionId);
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        if (isReorderMode) setColDragRef(node);
      }}
      data-column-id={column.id}
      data-columns-block-id={columnsBlockId}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...columnStyles,
        opacity: isDragging ? 0.4 : 1,
        cursor: isReorderMode ? "grab" : undefined,
        border: column.blocks.length === 0 ? "1px dashed #0000003a" : "",
      }}
      className={editorClasses}
      {...(isReorderMode ? listeners : {})}
      {...(isReorderMode ? attributes : {})}
    >
      {column.blocks.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full gap-1 pointer-events-none select-none">
          {isDraggingColumns ? (
            <span className="text-[11px] font-medium text-red-400 uppercase tracking-wide">Cannot nest columns</span>
          ) : (
            <>
              <span className="text-[11px] font-medium text-[var(--color-dark)]/30 uppercase tracking-wide">
                Column {(index ?? 0) + 1}/{total ?? "?"}
              </span>
              <span className="text-[10px] text-[var(--color-dark)]/20">Drop blocks here</span>
            </>
          )}
        </div>
      )}

      {column.blocks.map((childBlock) => (
        <BlockRenderer key={childBlock.id} block={childBlock} sectionId={sectionId} columnId={column.id} />
      ))}
    </div>
  );
}
