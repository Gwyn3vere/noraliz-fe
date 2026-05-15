import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types";
import { ListIcon, SquaresFourIcon, MagnifyingGlassIcon, XCircleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useDraggable, useDndContext } from "@dnd-kit/core";

interface MenuProps {
  category: MenuItem | null;
  onClose: () => void;
  onEnterMenu?: () => void;
  onLeaveMenu?: () => void;
}

function Menu({ category, onClose, onEnterMenu, onLeaveMenu }: MenuProps) {
  const [backdropVisible, setBackdropVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dndContext = useDndContext();
  const activeDrag = dndContext.active;

  // Khi có draggable được kéo, ẩn menu và backdrop
  useEffect(() => {
    if (activeDrag) {
      setIsDragActive(true);
      setBackdropVisible(false);
      setMenuVisible(false);
    } else if (isDragActive) {
      // Kéo thả kết thúc, đóng menu hẳn
      setIsDragActive(false);
      onClose();
    }
  }, [activeDrag, isDragActive, onClose]);

  // Mở menu khi có category
  useEffect(() => {
    if (category) {
      setShouldRender(true);
      requestAnimationFrame(() => setBackdropVisible(true));
      openTimerRef.current = setTimeout(() => {
        setMenuVisible(true);
      }, 150);
    } else {
      setMenuVisible(false);
      closeTimerRef.current = setTimeout(() => {
        setBackdropVisible(false);
      }, 200);
      closeTimerRef.current = setTimeout(() => {
        setShouldRender(false);
      }, 400);
    }

    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [category]);

  if (!shouldRender) return null;

  const blocks = category?.children || [];

  const groupedBlocks = blocks.reduce(
    (acc, block) => {
      if (!acc[block.type]) {
        acc[block.type] = [];
      }

      acc[block.type].push(block);

      return acc;
    },
    {} as Record<string, typeof blocks>,
  );

  return (
    <div
      className="absolute top-0 left-[260px] z-10 h-screen"
      style={{ width: "calc(100vw - 260px)" }}
      onMouseEnter={onEnterMenu}
      onMouseLeave={onLeaveMenu}
    >
      {/* Backdrop – ẩn khi đang kéo */}
      <div
        className={cn(
          "absolute inset-0 bg-[var(--color-dark)]/30 transition-opacity duration-250 ease-in-out",
          backdropVisible && !isDragActive ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Menu Panel – ẩn khi đang kéo */}
      <div
        className={cn(
          "relative z-20 bg-[#FBFBFB] h-screen border-l border-[var(--color-dark)]/10 transition-all duration-300 ease-in-out overflow-hidden",
          menuVisible && !isDragActive ? "max-w-[420px] translate-x-0" : "max-w-0 translate-x-[-420px]",
        )}
      >
        <div className="flex flex-col w-[420px] h-screen overflow-hidden">
          {/* Header */}
          <div className="h-[100px] px-[20px]">
            <div className="space-y-[20px] pt-[20px]">
              <div className="h-[20px] flex items-center justify-between">
                <div className="flex items-center gap-[5px]">
                  <ListIcon size={20} />
                  <span className="text-[14px] font-medium uppercase">Menu sidebar</span>
                </div>
                <Button className="h-[20px] w-[20px] !rounded-full" onClick={onClose}>
                  <XCircleIcon size={20} />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[30px] font-bold leading-none">{category?.label}</span>
                <div className="space-x-[10px]">
                  <Button className="h-[40px] w-[40px] border border-[var(--color-dark)]/40 !rounded-[10px]">
                    <SquaresFourIcon size={20} weight="fill" />
                  </Button>
                  <Button className="h-[40px] w-[40px] border border-[var(--color-dark)]/40 !rounded-[10px]">
                    <MagnifyingGlassIcon size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Grid các block */}
          <div className="flex-1 p-5 space-y-8 overflow-auto hover-scrollbar">
            {Object.entries(groupedBlocks).map(([type, items]) => (
              <div key={type}>
                {/* Title */}
                <h2 className="mb-4 text-lg font-semibold capitalize">{type}</h2>

                {/* Children */}
                <div className="grid grid-cols-2 gap-5">
                  {items.map((block) => (
                    <div key={block.id}>
                      <DraggableBlock block={block} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DraggableBlock({ block }: { block: MenuItem }) {
  const kind = block.kind;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `menu-${block.id}`,
    data: {
      blockType: block.type || block.id,
      blockId: block.id,
      kind: kind,
      variant: block.variant,
    },
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        opacity: isDragging ? 0 : 1,
      }
    : undefined;

  return (
    <div>
      <div
        ref={setNodeRef}
        className={cn(
          "border border-[var(--color-dark)]/10 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 cursor-grab transition-all group",
          "w-[180px] h-[180px] flex flex-col items-center justify-center gap-2 p-3 rounded-xl",
          "bg-[var(--color-light)]",
        )}
        style={style}
        {...listeners}
        {...attributes}
      >
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-lg bg-[var(--color-dark)]/5 flex items-center justify-center overflow-hidden">
          {block.thumbnail ? (
            <img src={block.thumbnail} alt={block.label} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-[var(--color-dark)]/30">{block.label[0]}</span>
          )}
        </div>
        {/* Tên block */}
        <span className="text-xs font-medium text-[var(--color-dark)]/70 group-hover:text-[var(--color-primary)] text-center leading-tight">
          {block.label}
        </span>
      </div>
    </div>
  );
}

export default React.memo(Menu);
