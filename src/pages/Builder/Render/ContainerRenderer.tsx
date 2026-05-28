import React, { useState, useCallback } from "react";
import { useEditorStore } from "@/stores/editorStore";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import { useBlockReorder } from "@/components/hooks/useBlockReorder";
import { BlockRenderer } from "./BlockRenderer";
import { cn } from "@/lib/utils";
import type { ContainerBlock } from "@/types";

interface ContainerRendererProps {
  container: ContainerBlock;
  sectionId: string;
  columnId?: string;
}

export function ContainerRenderer({ container, sectionId, columnId }: ContainerRendererProps) {
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const reorderingSectionId = useEditorStore((s) => s.reorderingSectionId);
  const isReorderMode = reorderingSectionId === sectionId;

  const isSelected = selectedBlockId === container.id;
  const [isHovered, setIsHovered] = useState(false);

  const dndContext = useDndContext();
  const activeDrag = dndContext.active;
  const activeBlockType = (activeDrag?.data?.current as any)?.blockType;

  const isDraggingColumns = activeBlockType === "columns";
  const isDraggingContainer = activeBlockType === "container";
  const isRejectedDrop = isDraggingColumns || isDraggingContainer;

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `container-${container.id}`,
    data: {
      sectionId,
      containerId: container.id,
      isContainer: true,
      ...(columnId ? { columnId } : {}),
    },
  });

  const {
    listeners,
    attributes,
    setNodeRef: setDragRef,
    isDragging,
  } = useBlockReorder(container.id, sectionId, columnId, undefined, !isReorderMode);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      selectBlock(container.id);
    },
    [container.id, selectBlock],
  );

  const showOutline = isHovered || isSelected;
  const children = container.children ?? [];

  return (
    <div
      ref={(node) => {
        setDropRef(node);
        if (isReorderMode) setDragRef(node);
      }}
      data-block-id={container.id}
      data-container-id={container.id}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...(container.props?.styles as React.CSSProperties),
        opacity: isDragging ? 0.4 : 1,
        cursor: isReorderMode ? "grab" : undefined,
        border: children.length === 0 && !isOver ? "1px dashed #0000003a" : "",
      }}
      className={cn(
        "relative transition-all outline outline-2 outline-dashed",
        showOutline ? "outline-[var(--color-primary)]" : "outline-transparent",
        isSelected
          ? "before:absolute before:inset-0 before:bg-[var(--color-primary)]/5 before:pointer-events-none"
          : "",
        isOver && !isRejectedDrop ? "bg-[var(--color-primary)]/10" : "",
        isOver && isRejectedDrop ? "bg-red-50 outline-red-400" : "",
        isReorderMode ? "cursor-grab active:cursor-grabbing ring-2 ring-[var(--color-primary)]/30" : "",
      )}
      {...(isReorderMode ? listeners : {})}
      {...(isReorderMode ? attributes : {})}
    >
      {children.length === 0 && !isOver && (
        <div className="flex items-center justify-center w-full h-full pointer-events-none select-none text-[var(--color-dark)]/20">
          <span className="text-[11px] font-medium text-[var(--color-dark)]/30 uppercase tracking-wide">
            Drop blocks here
          </span>
        </div>
      )}

      {isOver && isRejectedDrop && (
        <div className="flex items-center justify-center h-full pointer-events-none select-none">
          <span className="text-[11px] font-medium text-red-400 uppercase tracking-wide">
            Cannot nest {isDraggingColumns ? "columns" : "containers"}
          </span>
        </div>
      )}

      {children.map((childBlock) => (
        <BlockRenderer key={childBlock.id} block={childBlock} sectionId={sectionId} containerId={container.id} />
      ))}
    </div>
  );
}
