import { useDraggable } from "@dnd-kit/core";

export function useBlockReorder(
  blockId: string,
  sectionId: string,
  columnId?: string,
  containerId?: string,
  disabled: boolean = true,
) {
  let kind = "reorder-block";
  if (containerId) {
    kind = "reorder-container-block";
  } else if (columnId) {
    kind = "reorder-column-block";
  }
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `reorder-block-${blockId}`,
    disabled,
    data: {
      kind,
      blockId,
      sectionId,
      columnId,
      containerId,
    },
  });
  return { attributes, listeners, setNodeRef, isDragging };
}
