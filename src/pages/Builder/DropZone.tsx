import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  id: string;
  data: Record<string, unknown>; // chứa sectionId/pageId và order
  direction?: "vertical" | "horizontal";
  className?: string;
}

export function DropZone({ id, data, direction = "vertical", className }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id, data });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "transition-all duration-200 flex-shrink-0",
        direction === "vertical" ? "w-full" : "h-full w-2",
        isOver ? "bg-[var(--color-primary)]/40" : "bg-transparent hover:bg-[var(--color-primary)]/10",
        className,
      )}
    />
  );
}
