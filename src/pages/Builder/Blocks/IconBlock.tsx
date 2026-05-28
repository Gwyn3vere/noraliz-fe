import type { BlockRendererProps } from "@/types";
import { useBlockInteraction } from "@/components/hooks/useBlockInteraction";
import { cn } from "@/lib/utils";

export function IconBlock({ block, sectionId, columnId, containerId }: BlockRendererProps) {
  const { ref, props, style, className } = useBlockInteraction(block, sectionId, columnId, containerId);

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      data-block-id={block.id}
      {...props}
      style={style}
      className={cn(className, "inline-flex")}
    >
      <svg width={(block as any).props?.size || 24} height={(block as any).props?.size || 24}>
        <circle cx="12" cy="12" r="10" fill={(block as any).props?.color || "#000"} />
      </svg>
    </div>
  );
}
