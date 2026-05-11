import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types";
import { Button } from "@/components/ui/button";
import { SquaresFourIcon, MagnifyingGlassIcon, XCircleIcon, ListIcon } from "@phosphor-icons/react";

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
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (category) {
      // Mở menu
      setShouldRender(true);
      // Backdrop fade in ngay lập tức
      requestAnimationFrame(() => setBackdropVisible(true));
      // Chờ 150ms rồi mới trượt menu vào (tạo hiệu ứng tuần tự)
      openTimerRef.current = setTimeout(() => {
        setMenuVisible(true);
      }, 150);
    } else {
      // Đóng menu
      setMenuVisible(false); // Menu trượt ra trước
      closeTimerRef.current = setTimeout(() => {
        setBackdropVisible(false); // Backdrop fade out sau 200ms
      }, 200);
      // Sau 400ms thì unmount để tiết kiệm tài nguyên
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

  return (
    <div className="absolute top-0 left-[260px] z-10 h-screen" style={{ width: "calc(100vw - 260px)" }}>
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-[var(--color-dark)]/30 transition-opacity duration-300 ease-in-out",
          backdropVisible ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={cn(
          "relative z-20 bg-[#FBFBFB] h-screen border-l border-[var(--color-dark)]/10 transition-all duration-300 ease-in-out",
          menuVisible ? "max-w-[420px] translate-x-0" : "max-w-0 translate-x-[-420px]",
        )}
        onMouseEnter={onEnterMenu}
        onMouseLeave={onLeaveMenu}
      >
        <div className="w-[420px]">
          {/* Header */}
          <div className={cn("h-[100px] px-[20px]")}>
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
          <div className="p-5">
            <div className="grid grid-cols-2 gap-5">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className={cn(
                    "border border-[var(--color-dark)]/10 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 cursor-pointer transition-all group",
                    "w-[180px] h-[180px] flex flex-col items-center justify-center gap-2 p-3 rounded-xl",
                    "bg-[var(--color-light)]",
                  )}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("blockType", block.id);
                    e.dataTransfer.effectAllowed = "copy";
                  }}
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Menu);
