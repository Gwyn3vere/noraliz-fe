import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsOutCardinalIcon,
  CodeIcon,
  CopySimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { useEditorStore } from "@/stores/editorStore";
import { cn } from "@/lib/utils";

interface Props {
  sectionId: string;
  order: number;
  onClose?: () => void;
}

export function FloatingSectionToolbar({ sectionId, order, onClose }: Props) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const reorderingSectionId = useEditorStore((state) => state.reorderingSectionId);
  const setReorderingSection = useEditorStore((state) => state.setReorderingSection);
  const reorderSections = useEditorStore((state) => state.reorderSections);
  const currentPage = useEditorStore((state) => state.getCurrentPage());
  const removeSection = useEditorStore((state) => state.removeSection);
  const clearSelection = useEditorStore((state) => state.clearSelection);

  const isReorderActive = reorderingSectionId === sectionId;
  const sections = currentPage?.sections || [];
  const currentIndex = sections.findIndex((s) => s.id === sectionId);

  const moveUp = () => {
    if (currentIndex > 0) {
      reorderSections(currentIndex, currentIndex - 1);
    }
  };
  const moveDown = () => {
    if (currentIndex < sections.length - 1) {
      reorderSections(currentIndex, currentIndex + 1);
    }
  };

  const handleRemove = () => {
    removeSection(sectionId);
    clearSelection();
    onClose?.();
  };

  const updatePosition = useCallback(() => {
    const sectionElement = document.getElementById(sectionId);
    const canvasElement = document.getElementById("builder-canvas");
    if (!sectionElement || !canvasElement || !toolbarRef.current) return;

    const sectionRect = sectionElement.getBoundingClientRect();
    const canvasRect = canvasElement.getBoundingClientRect();
    const toolbarWidth = toolbarRef.current.offsetWidth || 300;

    let left = sectionRect.left + sectionRect.width / 2;
    const top = sectionRect.top - 50;

    const minLeft = canvasRect.left + toolbarWidth / 2;
    const maxLeft = canvasRect.right - toolbarWidth / 2;
    left = Math.max(minLeft, Math.min(left, maxLeft));

    setPosition({ top, left });
  }, [sectionId]);

  useEffect(() => {
    let rafId: number;
    const loop = () => {
      updatePosition();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [updatePosition]);

  useEffect(() => {
    updatePosition();
  }, [order, updatePosition]);

  return createPortal(
    <div
      ref={toolbarRef}
      className="fixed z-50 bg-[var(--color-dark)] flex flex-nowrap items-center gap-1 text-white rounded-full px-2 py-1"
      style={{
        top: position.top,
        left: position.left,
        transform: "translateX(-50%)",
        whiteSpace: "nowrap",
      }}
    >
      <span className="text-xs font-medium text-gray-500 pl-2">Section #{order}</span>
      <div>
        <Button onClick={moveUp} className="w-[40px] h-[40px] !rounded-full hover:bg-[var(--color-light)]/5">
          <ArrowUpIcon size={20} weight="bold" />
        </Button>
        <Button onClick={moveDown} className="w-[40px] h-[40px] !rounded-full hover:bg-[var(--color-light)]/5">
          <ArrowDownIcon size={20} weight="bold" />
        </Button>
      </div>
      <div>
        <Button
          className={cn(
            "w-[40px] h-[40px] !rounded-full",
            isReorderActive ? "bg-[var(--color-primary)] text-white" : "hover:bg-[var(--color-light)]/5",
          )}
          onClick={(e) => {
            e.stopPropagation();
            setReorderingSection(isReorderActive ? null : sectionId);
          }}
        >
          <ArrowsOutCardinalIcon size={20} weight="bold" />
        </Button>
        <Button className="w-[40px] h-[40px] !rounded-full hover:bg-[var(--color-light)]/5">
          <CodeIcon size={20} weight="bold" />
        </Button>
      </div>
      <div>
        <Button className="w-[40px] h-[40px] !rounded-full hover:bg-[var(--color-light)]/5">
          <CopySimpleIcon size={20} weight="bold" />
        </Button>
        <Button className="w-[40px] h-[40px] !rounded-full hover:bg-[var(--color-light)]/5" onClick={handleRemove}>
          <TrashIcon size={20} weight="bold" />
        </Button>
      </div>
    </div>,
    document.body,
  );
}
