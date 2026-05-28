import type { BlockRendererProps } from "@/types";
import { useBlockInteraction } from "@/components/hooks/useBlockInteraction";
import { cn } from "@/lib/utils";

export function MapBlock({ block, sectionId, columnId, containerId }: BlockRendererProps) {
  const { ref, props, style, className } = useBlockInteraction(block, sectionId, columnId, containerId);

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      data-block-id={block.id}
      {...props}
      style={{ ...style }}
      className={cn(className, "w-full h-64")}
    >
      <iframe
        src={(block as any).props?.embedUrl || "https://maps.google.com/maps?q=Hanoi&output=embed"}
        width="100%"
        height="100%"
        className="pointer-events-none"
      />
    </div>
  );
}
