import { useDroppable } from "@dnd-kit/core";

export function useContainerDrop(containerId: string, sectionId: string) {
  const { setNodeRef, isOver } = useDroppable({
    id: `container-${containerId}`,
    data: { sectionId, containerId, isContainer: true },
  });
  return { setNodeRef, isOver };
}
