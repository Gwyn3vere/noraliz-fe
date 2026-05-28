import type { BlockRendererProps, ButtonBlock } from "@/types";
import { useBlockInteraction } from "@/components/hooks/useBlockInteraction";
import { useInlineEdit } from "@/components/hooks/useInlineEdit";
import { cn } from "@/lib/utils";

export function ButtonBlock({ block, sectionId, columnId, containerId }: BlockRendererProps) {
  const { ref, props, style, className } = useBlockInteraction(block, sectionId, columnId, containerId);

  const { isEditing, contentRef, handleDoubleClick, handleBlur, handleKeyDown } = useInlineEdit(block);

  const btnBlock = block as ButtonBlock;
  const rawHref = btnBlock.props?.href;
  const href = typeof rawHref === "string" ? rawHref.trim() : "";
  const label = btnBlock.props?.label || "Button";

  if (href) {
    return (
      <a
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
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={style}
        className={cn(className)}
        onClick={(e) => {
          e.preventDefault();
          props.onClick?.(e);
        }}
      >
        {label}
      </a>
    );
  }

  return (
    <button
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
      type="button"
      style={style}
      className={cn(className)}
    >
      {label}
    </button>
  );
}
