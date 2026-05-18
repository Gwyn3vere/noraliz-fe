import { useDraggable } from "@dnd-kit/core";

export function useColumnReorder(columnId: string, columnsBlockId: string, sectionId: string, disabled = true) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `reorder-column-${columnId}`,
    disabled,
    data: {
      kind: "reorder-column",
      columnId,
      columnsBlockId,
      sectionId,
    },
  });
  return { attributes, listeners, setNodeRef, isDragging };
}
