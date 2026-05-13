import { useEffect, useRef, useState } from "react";
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

interface Props {
  sectionId: string;
  order: number;
  onClose?: () => void;
}

export function FloatingSectionToolbar({ sectionId, order }: Props) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const sectionElement = document.getElementById(sectionId);
    const canvasElement = document.getElementById("builder-canvas");
    if (!sectionElement || !canvasElement) return;

    const updatePosition = () => {
      const sectionRect = sectionElement.getBoundingClientRect();
      const canvasRect = canvasElement.getBoundingClientRect();
      const toolbarWidth = toolbarRef.current?.offsetWidth || 300;

      // Vị trí mặc định: giữa trên của section
      let left = sectionRect.left + sectionRect.width / 2;
      const top = sectionRect.top - 50;

      // Giới hạn left trong phạm vi canvas
      const minLeft = canvasRect.left + toolbarWidth / 2;
      const maxLeft = canvasRect.right - toolbarWidth / 2;
      left = Math.max(minLeft, Math.min(left, maxLeft));

      setPosition({ top, left });
    };

    updatePosition();
    setIsVisible(true);

    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [sectionId]);

  if (!isVisible) return null;

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
      {/* Move */}
      <div>
        <Button className="w-[40px] h-[40px] !rounded-full hover:bg-[var(--color-light)]/5">
          <ArrowUpIcon size={20} weight="bold" />
        </Button>
        <Button className="w-[40px] h-[40px] !rounded-full hover:bg-[var(--color-light)]/5">
          <ArrowDownIcon size={20} weight="bold" />
        </Button>
      </div>
      {/* Drag - Code */}
      <div>
        <Button className="w-[40px] h-[40px] !rounded-full hover:bg-[var(--color-light)]/5">
          <ArrowsOutCardinalIcon size={20} weight="bold" />
        </Button>
        <Button className="w-[40px] h-[40px] !rounded-full hover:bg-[var(--color-light)]/5">
          <CodeIcon size={20} weight="bold" />
        </Button>
      </div>
      {/* Duplicate - Remove */}
      <div>
        <Button className="w-[40px] h-[40px] !rounded-full hover:bg-[var(--color-light)]/5">
          <CopySimpleIcon size={20} weight="bold" />
        </Button>
        <Button className="w-[40px] h-[40px] !rounded-full hover:bg-[var(--color-light)]/5">
          <TrashIcon size={20} weight="bold" />
        </Button>
      </div>
    </div>,
    document.body,
  );
}
