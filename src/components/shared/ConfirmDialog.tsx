import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  isLoading?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    },
    [open, onOpenChange],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in-0"
      onClick={(e) => {
        if (e.target === overlayRef.current && !isLoading) {
          onOpenChange(false);
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="bg-white rounded-[10px] shadow-lg p-6 w-full max-w-md mx-4 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-dark)]">{title}</h2>
          <button
            onClick={() => !isLoading && onOpenChange(false)}
            className="p-1 rounded-[10px] hover:bg-gray-100 transition-colors cursor-pointer"
            disabled={isLoading}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <p className="text-sm text-gray-500 mb-6">{description}</p>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="bg-gray-100 hover:bg-gray-200 !rounded-[10px]"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-[var(--color-primary)] text-white !rounded-[10px]"
          >
            {isLoading ? "Deleting..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
