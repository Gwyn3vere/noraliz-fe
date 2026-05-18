import { useDroppable } from "@dnd-kit/core";

export function useColumnDrop(columnId: string, sectionId: string, columnsBlockId?: string) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${columnId}`,
    data: { sectionId, columnId, isColumn: true, columnsBlockId },
  });
  return { setNodeRef, isOver };
}
