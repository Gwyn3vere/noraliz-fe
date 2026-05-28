import { useEffect, useRef, useCallback, useState } from "react";
import { useEditorStore } from "@/stores/editorStore";
import { updateProject } from "@/services/projectApi";

const AUTO_SAVE_INTERVAL = 30 * 1000;

export function useAutoSave() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const isDirty = useEditorStore((state) => state.isDirty);
  const currentProject = useEditorStore((state) => state.currentProject);
  const lastSavedAt = useEditorStore((state) => state.lastSavedAt);
  const markSaved = useEditorStore((state) => state.markSaved);

  const performSave = useCallback(async () => {
    if (!currentProject) return;
    setIsSaving(true);
    try {
      await updateProject(currentProject.id, {
        name: currentProject.name,
        description: (currentProject as any).description || "",
        jsonData: {
          pages: currentProject.pages,
        },
      });
      markSaved();
    } catch (error) {
      console.error("Auto save failed:", error);
    } finally {
      setIsSaving(false);
    }
  }, [currentProject, markSaved]);

  useEffect(() => {
    if (isDirty && !timerRef.current) {
      timerRef.current = setTimeout(() => {
        performSave();
        timerRef.current = null;
      }, AUTO_SAVE_INTERVAL);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isDirty, performSave]);

  return { performSave, isSaving, lastSavedAt, isDirty };
}
