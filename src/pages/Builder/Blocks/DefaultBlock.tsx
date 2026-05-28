import type { BlockRendererProps } from "@/types";
import { useBlockInteraction } from "@/components/hooks/useBlockInteraction";
import { cn } from "@/lib/utils";

export function DefaultBlock({ block, sectionId, columnId, containerId }: BlockRendererProps) {
  const { ref, props, style, className } = useBlockInteraction(block, sectionId, columnId, containerId);

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      data-block-id={block.id}
      {...props}
      style={style}
      className={cn(className)}
    >
      <p className="text-gray-500 text-sm">{block.type}</p>
    </div>
  );
}
