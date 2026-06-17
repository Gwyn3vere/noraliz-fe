import { useState, useEffect } from "react";
import { builderStyles as styles } from "./Builder.styles";
import { useEditorStore } from "@/stores/editorStore";
import { cn } from "@/lib/utils";

export function StatusBar({
  isSaving,
  lastSavedAt,
  isDirty,
}: {
  isSaving: boolean;
  lastSavedAt: string | null;
  isDirty: boolean;
}) {
  const [timeAgo, setTimeAgo] = useState("");
  const currentProject = useEditorStore((state) => state.currentProject);
  const pages = currentProject?.pages ?? [];

  useEffect(() => {
    const update = () => {
      if (!lastSavedAt) {
        setTimeAgo("");
        return;
      }
      const seconds = Math.floor((Date.now() - new Date(lastSavedAt).getTime()) / 1000);
      if (seconds < 5) {
        setTimeAgo("Just now");
      } else if (seconds < 60) {
        setTimeAgo(`${seconds}s ago`);
      } else {
        setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
      }
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [lastSavedAt]);

  let status = "Saved: " + (timeAgo || "Never");
  if (isSaving) status = "Saving...";
  else if (isDirty && !isSaving && lastSavedAt) status = "Unsaved changes";

  return (
    <div className={cn(styles.canvasStatus, styles.canvasButtonShadow)}>
      <span>{status}</span>
      <span className="text-[var(--color-dark)]/20">|</span>
      <span>
        {pages.length == 1 ? "Page" : "Pages"}: {pages.length || 1}
      </span>
    </div>
  );
}
