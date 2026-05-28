import type { BlockRendererProps } from "@/types";
import { useBlockInteraction } from "@/components/hooks/useBlockInteraction";
import { getEmbedUrl } from "@/helper/getEmbedUrl";
import { cn } from "@/lib/utils";

export function VideoBlock({ block, sectionId, columnId, containerId }: BlockRendererProps) {
  const { ref, props, style, className } = useBlockInteraction(block, sectionId, columnId, containerId);
  const videoProps = (block as any).props || {};
  const embedUrl = videoProps.embedUrl;
  const fileUrl = videoProps.fileUrl;

  const finalEmbedUrl = embedUrl ? getEmbedUrl(embedUrl) : "";

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      data-block-id={block.id}
      {...props}
      style={{ ...style }}
      className={cn(className, "overflow-hidden")}
    >
      {embedUrl ? (
        <iframe src={finalEmbedUrl} allowFullScreen className="pointer-events-none" style={style} />
      ) : fileUrl ? (
        <video src={fileUrl} controls className="max-w-full" style={style} />
      ) : (
        <div className="flex items-center justify-center" style={style}>
          <span>No video source</span>
        </div>
      )}
    </div>
  );
}
