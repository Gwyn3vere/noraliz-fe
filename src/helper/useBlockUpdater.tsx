import { useCallback } from "react";
import { useEditorStore } from "@/stores/editorStore";

export default function useBlockUpdater(blockId: string) {
  const updateBlock = useEditorStore((s) => s.updateBlock);

  return useCallback(
    (newProps: Record<string, unknown>) => {
      updateBlock(blockId, (block) => ({
        ...block,
        props: { ...(block as any).props, ...newProps },
      }));
    },
    [blockId, updateBlock],
  );
}
