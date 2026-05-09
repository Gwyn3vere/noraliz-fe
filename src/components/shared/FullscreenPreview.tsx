import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Trash2 } from "lucide-react";

interface FullscreenPreviewProps {
  src: string | null;
  alt?: string;
  onClose: () => void;
}

export function FullscreenPreview({ src, alt = "Preview", onClose }: FullscreenPreviewProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Hỗ trợ đóng bằng phím Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  // Khóa scroll của body khi mở preview
  useEffect(() => {
    if (!src) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [src, handleKeyDown]);

  // Nếu không có ảnh, không render gì cả
  if (!src) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-in fade-in-0"
      onClick={(e) => {
        // Chỉ đóng khi click trực tiếp vào overlay, không phải vào ảnh
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      {/* Nút Close */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={onClose}
          className=" p-2 rounded-full bg-white hover:bg-[var(--color-primary)] hover:text-white transition-colors cursor-pointer"
          aria-label="Close preview"
        >
          <X size={24} />
        </button>
        <button
          onClick={onClose}
          className=" p-2 rounded-full bg-white hover:bg-[var(--color-primary)] hover:text-white transition-colors cursor-pointer"
          aria-label="Delete image"
        >
          <Trash2 size={24} />
        </button>
      </div>

      {/* Ảnh */}
      <img src={src} alt={alt} className="max-w-[90vw] max-h-[90vh] object-contain rounded-[30px] shadow-2xl" />
    </div>,
    document.body,
  );
}
