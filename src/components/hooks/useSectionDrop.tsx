import { useDroppable } from "@dnd-kit/core";

export function useSectionDrop(sectionId: string) {
  const { setNodeRef, isOver } = useDroppable({
    id: `section-${sectionId}`,
    data: { sectionId },
  });

  return { setNodeRef, isOver };
}
