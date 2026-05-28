import type { BlockRendererProps } from "@/types";
import { useBlockInteraction } from "@/components/hooks/useBlockInteraction";
import { useInlineEdit } from "@/components/hooks/useInlineEdit";
import { cn } from "@/lib/utils";

export function TextBlock({ block, sectionId, columnId, containerId }: BlockRendererProps) {
  const { ref, props, style, className } = useBlockInteraction(block, sectionId, columnId, containerId);

  const { isEditing, contentRef, handleDoubleClick, handleBlur, handleKeyDown } = useInlineEdit(block);

  return (
    <p
      ref={(node) => {
        ref(node);
        contentRef.current = node;
      }}
      data-block-id={block.id}
      {...props}
      contentEditable={isEditing}
      suppressContentEditableWarning
      spellCheck={false}
      autoCorrect="off"
      autoCapitalize="off"
      data-gramm="false"
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={style}
      className={cn(className, isEditing && "cursor-text outline-none")}
    >
      {(block as any).props?.content || "Text content"}
    </p>
  );
}
