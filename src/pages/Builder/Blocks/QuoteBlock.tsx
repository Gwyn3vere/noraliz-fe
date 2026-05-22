import type { BlockRendererProps } from "@/types";
import { useBlockInteraction } from "@/components/hooks/useBlockInteraction";
import { useInlineEdit } from "@/components/hooks/useInlineEdit";
import { cn } from "@/lib/utils";

export function QuoteBlock({ block, sectionId, columnId, containerId }: BlockRendererProps) {
  const { ref, props, style, className } = useBlockInteraction(block, sectionId, columnId, containerId);

  const { isEditing, contentRef, handleDoubleClick, handleBlur, handleKeyDown } = useInlineEdit(block);

  return (
    <blockquote
      ref={(node) => {
        ref(node);
        contentRef.current = node;
      }}
      data-block-id={block.id}
      {...props}
      contentEditable={isEditing}
      suppressContentEditableWarning
      spellCheck={false}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={style}
      className={cn(className, "italic", isEditing && "cursor-text outline-none")}
    >
      {(block as any).props?.content || "Quote"}
    </blockquote>
  );
}
