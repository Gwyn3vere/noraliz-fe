import type { BlockRendererProps, ColumnsBlock } from "@/types";
import { useBlockInteraction } from "@/components/hooks/useBlockInteraction";
import { cn } from "@/lib/utils";
import { ColumnRenderer } from "../Render/ColumnRenderer";

export function ColsBlock({ block, sectionId, columnId, containerId }: BlockRendererProps) {
  const { ref, props, style, className } = useBlockInteraction(block, sectionId, columnId, containerId);

  const columnsBlock = block as ColumnsBlock;

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      data-block-id={block.id}
      {...props}
      className={cn(className)}
      style={style}
    >
      {columnsBlock.children.map((column, index) => (
        <ColumnRenderer
          key={column.id}
          column={column}
          columnsBlockId={columnsBlock.id}
          sectionId={sectionId}
          index={index}
          total={columnsBlock.children.length}
        />
      ))}
    </div>
  );
}
