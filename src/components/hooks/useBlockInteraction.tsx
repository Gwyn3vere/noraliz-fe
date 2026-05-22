import { useCallback, useState } from "react";
import { useEditorStore } from "@/stores/editorStore";
import { useBlockDrop } from "./useBlockDrop";
import { useBlockReorder } from "./useBlockReorder";
import type { Block } from "@/types";
import { cn } from "@/lib/utils";

export function useBlockInteraction(block: Block, sectionId: string, columnId?: string, containerId?: string) {
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const reorderingSectionId = useEditorStore((s) => s.reorderingSectionId);

  const isReorderMode = reorderingSectionId === sectionId;
  const isSelected = selectedBlockId === block.id;

  const [isHovered, setIsHovered] = useState(false);

  const { setNodeRef: setDropRef, isOver } = useBlockDrop(block.id, sectionId, columnId, containerId);

  const {
    listeners,
    attributes,
    setNodeRef: setDragRef,
    isDragging,
  } = useBlockReorder(block.id, sectionId, columnId, containerId, !isReorderMode);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      setDropRef(node);

      if (isReorderMode) {
        setDragRef(node);
      }
    },
    [setDropRef, setDragRef, isReorderMode],
  );

  const style: React.CSSProperties = {
    ...(block as any).props?.styles,
    opacity: isDragging ? 0.4 : 1,
  };

  const showOutline = isHovered || isSelected;

  const className = cn(
    "relative cursor-pointer transition-all outline outline-2 outline-dashed",
    showOutline ? "outline-[var(--color-primary)]" : "outline-transparent",
    isSelected && "before:absolute before:inset-0 before:bg-[var(--color-primary)]/5 before:pointer-events-none",
    isOver && "bg-[var(--color-primary)]/10",
    isReorderMode && "cursor-grab active:cursor-grabbing ring-2 ring-[var(--color-primary)]/30",
  );

  const props = {
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      selectBlock(block.id);
    },

    onMouseEnter: () => setIsHovered(true),

    onMouseLeave: () => setIsHovered(false),

    ...(isReorderMode
      ? {
          ...listeners,
          ...attributes,
        }
      : {}),
  };

  return {
    ref,
    props,
    style,
    className,
  };
}
