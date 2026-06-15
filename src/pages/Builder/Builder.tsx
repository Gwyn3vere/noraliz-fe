import { useState, useEffect } from "react";
import { useProjectLoader } from "@/components/hooks/useProjectLoader";
import { useProjectInit } from "@/components/hooks/useProjectInit";
import { usePrimitiveBlocks } from "@/components/hooks/usePrimitiveBlocks";
import { useBlockDnD } from "@/components/hooks/useBlockDnD";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProjectLoader from "../Loading/ProjectLoader";
import LeftPanel from "./LeftPanel";
import RighPanel from "./RightPanel";
import Canvas from "./Canvas";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useEditorStore } from "@/stores/editorStore";
import type { Block } from "@/types";

export default function Builder() {
  const { project, isLoading, error } = useProjectLoader();
  const [isLoaderReady, setIsLoaderReady] = useState(false);
  const [isApiDone, setIsApiDone] = useState(false);

  const { blocks: primitiveBlocks } = usePrimitiveBlocks();
  const { sensors, collisionDetection, handleDragStart, handleDragEnd, handleDragOver, overlayProps } = useBlockDnD({
    primitiveBlocks,
  });

  useProjectInit(project);

  useEffect(() => {
    if (!isLoading && !error) setIsApiDone(true);
  }, [isLoading, error]);

  if (!isLoaderReady) {
    return <ProjectLoader onReady={() => setIsLoaderReady(true)} isWaiting={!isApiDone} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">{error}</p>
        <Link to="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex overflow-hidden">
        <LeftPanel />
        <Canvas />
        <RighPanel />
      </div>

      <DragOverlay style={{ pointerEvents: "none" }}>
        {overlayProps.activeDragItem &&
          (() => {
            const kind = overlayProps.activeDragKind;
            const data = overlayProps.activeDragData;

            // Section từ menu
            if (kind === "section") {
              return (
                <div className="w-[200px] h-[80px] bg-[var(--color-primary)]/10 border-2 border-dashed border-[var(--color-primary)] rounded-xl flex items-center justify-center opacity-90">
                  <span className="text-sm font-medium text-[var(--color-primary)]">New Section</span>
                </div>
              );
            }

            // Reorder block — hiện actual block content (ghost)
            if (kind === "reorder-block") {
              const blockId = data?.blockId;
              const sectionId = data?.sectionId;
              const store = useEditorStore.getState();
              const page = store.getCurrentPage();
              const section = page?.sections.find((s) => s.id === sectionId);
              const block = section?.blocks.find((b) => b.id === blockId);

              return block ? (
                <div className="opacity-80 pointer-events-none scale-105 shadow-xl rounded border-2 border-[var(--color-primary)]">
                  {/* Render block thực tế nhưng ở dạng ghost */}
                  <BlockGhost block={block} />
                </div>
              ) : null;
            }

            // Block mới từ menu
            const block = overlayProps.getBlockById(overlayProps.activeDragItem!.replace("menu-", ""));
            return block ? (
              <div className="w-[180px] h-[60px] flex items-center gap-3 px-4 rounded-xl bg-[var(--color-light)] border border-[var(--color-primary)] shadow-lg opacity-90">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-dark)]/5 flex items-center justify-center flex-shrink-0">
                  {block.thumbnailUrl ? (
                    <img src={block.thumbnailUrl} alt={block.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-[var(--color-dark)]/30">{block.name[0]}</span>
                  )}
                </div>
                <span className="text-xs font-medium text-[var(--color-dark)]/70">{block.name}</span>
              </div>
            ) : null;
          })()}
      </DragOverlay>
    </DndContext>
  );
}

function BlockGhost({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
      return <p className="p-2 bg-white text-sm">{(block as any).props?.content || "Text"}</p>;
    case "heading":
      return <p className="p-2 bg-white font-bold">{(block as any).props?.content || "Heading"}</p>;
    case "image":
      return <img src={(block as any).props?.src || "https://placehold.co/200x80"} className="max-w-[200px]" />;
    case "button":
      return (
        <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg">
          {(block as any).props?.label || "Button"}
        </button>
      );
    default:
      return (
        <div className="p-2 bg-white min-w-[120px]">
          <span className="text-xs text-gray-500">{block.type}</span>
        </div>
      );
  }
}
