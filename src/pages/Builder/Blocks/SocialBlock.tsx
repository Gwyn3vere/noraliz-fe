import type { BlockRendererProps } from "@/types";
import { useBlockInteraction } from "@/components/hooks/useBlockInteraction";
import { cn } from "@/lib/utils";

export function SocialBlock({ block, sectionId, columnId, containerId }: BlockRendererProps) {
  const { ref, props, style, className } = useBlockInteraction(block, sectionId, columnId, containerId);

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      data-block-id={block.id}
      {...props}
      style={style}
      className={cn(className, "flex gap-2")}
    >
      {((block as any).props?.links as any[])?.map((link, i) => (
        <div
          key={i}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs"
          title={link.platform}
        >
          {link.platform?.[0]?.toUpperCase() || "?"}
        </div>
      )) || "No links"}
    </div>
  );
}
