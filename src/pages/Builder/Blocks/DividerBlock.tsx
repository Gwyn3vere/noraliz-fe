import type { BlockRendererProps } from "@/types";
import { useBlockInteraction } from "@/components/hooks/useBlockInteraction";
import { cn } from "@/lib/utils";

export function DividerBlock({ block, sectionId, columnId, containerId }: BlockRendererProps) {
  const { ref, props, style, className } = useBlockInteraction(block, sectionId, columnId, containerId);

  return (
    <hr
      ref={ref as React.Ref<HTMLHRElement>}
      data-block-id={block.id}
      {...props}
      className={cn(className)}
      style={{
        ...style,
      }}
    />
  );
}
