import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { builderStyles as styles } from "./Builder.styles";
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
    <div className={styles.menuContainer} style={{ width: "calc(100vw - 260px)" }}>
      {/* Backdrop */}
      <div className={cn(styles.menuBackdrop, backdropVisible ? "opacity-100" : "opacity-0")} onClick={onClose} />

      {/* Menu Panel */}
      <div
        className={cn(styles.menuPanel, menuVisible ? "max-w-[420px] translate-x-0" : "max-w-0 translate-x-[-420px]")}
        onMouseEnter={onEnterMenu}
        onMouseLeave={onLeaveMenu}
      >
        <div className="w-[420px]">
          {/* Header */}
          <div className={styles.menuPanelHeaderSize}>
            <div className={styles.menuPanelHeaderSpace}>
              <div className={styles.menuPanelHeaderTitle}>
                <div className={styles.menuPanelHeaderTitleLayout}>
                  <ListIcon size={20} />
                  <span className={styles.menuPanelHeaderTitleText}>Menu sidebar</span>
                </div>
                <Button className="h-[20px] w-[20px] !rounded-full" onClick={onClose}>
                  <XCircleIcon size={20} />
                </Button>
              </div>

              <div className={styles.menuPanelHeaderCategory}>
                <span className={styles.menuPanelHeaderCategoryLabel}>{category?.label}</span>
                <div className="space-x-[10px]">
                  <Button className={styles.menuPanelHeaderCategoryButton}>
                    <SquaresFourIcon size={20} weight="fill" />
                  </Button>
                  <Button className={styles.menuPanelHeaderCategoryButton}>
                    <MagnifyingGlassIcon size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Grid các block */}
          <div className="p-5">
            <div className={styles.menuPanelList}>
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className={styles.menuPanelBlock}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("blockType", block.id);
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                >
                  {/* Thumbnail */}
                  <div className={styles.menuPanelThumbail}>
                    {block.thumbnail ? (
                      <img src={block.thumbnail} alt={block.label} className={styles.menuPanelThumbailImg} />
                    ) : (
                      <span className={styles.menuPanelThumbailLabel}>{block.label[0]}</span>
                    )}
                  </div>
                  {/* Tên block */}
                  <span className={styles.menuPanelBlockLabel}>{block.label}</span>
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
