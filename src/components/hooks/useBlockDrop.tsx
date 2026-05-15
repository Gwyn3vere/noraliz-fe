import { useDroppable } from "@dnd-kit/core";

export function useBlockDrop(blockId: string, sectionId: string, columnId?: string) {
  const { setNodeRef, isOver } = useDroppable({
    id: `block-${blockId}`,
    data: {
      sectionId,
      blockId,
      columnId,
      isColumn: !!columnId,
    },
  });
  return { setNodeRef, isOver };
}
