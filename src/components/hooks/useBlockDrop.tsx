import { useDroppable } from "@dnd-kit/core";

export function useBlockDrop(blockId: string, sectionId: string, columnId?: string, containerId?: string) {
  const { setNodeRef, isOver } = useDroppable({
    id: `block-${blockId}`,
    data: {
      sectionId,
      blockId,
      columnId,
      isColumn: !!columnId,
      containerId,
      isInContainer: !!containerId,
    },
  });
  return { setNodeRef, isOver };
}
