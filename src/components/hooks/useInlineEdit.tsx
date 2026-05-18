import { useState, useEffect, useRef, useCallback } from "react";
import type { Block } from "@/types";
import { useEditorStore } from "@/stores/editorStore";

export function useInlineEdit(block: Block) {
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const setInlineEditing = useEditorStore((s) => s.setInlineEditing);

  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLElement | null>(null);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsEditing(true);
      setInlineEditing(true);

      const range = document.caretRangeFromPoint(e.clientX, e.clientY);
      if (range) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    },
    [setInlineEditing],
  );

  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = useCallback(() => {
    if (!contentRef.current) return;
    const newContent = contentRef.current.innerText || "";
    updateBlock(block.id, (prev) => ({
      ...prev,
      props: { ...(prev as any).props, content: newContent },
    }));
    setIsEditing(false);
    setInlineEditing(false);
  }, [block.id, updateBlock, setInlineEditing]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      contentRef.current?.blur();
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      contentRef.current?.blur();
    }
  }, []);

  return {
    isEditing,
    contentRef,
    handleDoubleClick,
    handleBlur,
    handleKeyDown,
  };
}
