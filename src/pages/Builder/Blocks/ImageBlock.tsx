import type { BlockRendererProps } from "@/types";
import { useBlockInteraction } from "@/components/hooks/useBlockInteraction";
import { cn } from "@/lib/utils";

export function ImageBlock({ block, sectionId, columnId, containerId }: BlockRendererProps) {
  const { ref, props, style, className } = useBlockInteraction(block, sectionId, columnId, containerId);

  return (
    <img
      ref={ref as React.Ref<HTMLImageElement>}
      data-block-id={block.id}
      {...props}
      src={(block as any).props?.src || "https://placehold.co/600x400"}
      alt={(block as any).props?.alt || "Image"}
      className={cn(className, "max-w-full")}
      style={style}
    />
  );
}
