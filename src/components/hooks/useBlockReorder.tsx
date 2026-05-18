import { useDraggable } from "@dnd-kit/core";

export function useBlockReorder(blockId: string, sectionId: string, columnId?: string, disabled: boolean = true) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `reorder-block-${blockId}`,
    disabled,
    data: {
      kind: columnId ? "reorder-column-block" : "reorder-block",
      blockId,
      sectionId,
      columnId,
    },
  });
  return { attributes, listeners, setNodeRef, isDragging };
}
