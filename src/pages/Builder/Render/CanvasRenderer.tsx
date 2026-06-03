import React from "react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editorStore";
import { images } from "@/assets/images";
import { useDroppable } from "@dnd-kit/core";
import { DropZone } from "../DropZone";
import { SectionRenderer } from "./SectionRenderer";
import { useFontInjector } from "@/components/hooks/useFontInjector";

export function CanvasRenderer() {
  const currentProject = useEditorStore((state) => state.currentProject);
  const currentPageId = useEditorStore((state) => state.currentPageId);

  const currentPage = currentProject?.pages.find((p) => p.id === currentPageId);

  useFontInjector(currentPage?.sections);

  const { setNodeRef: setPageRef, isOver: isPageOver } = useDroppable({
    id: `page-drop-0`,
    data: { pageId: currentPage?.id, order: 0 },
  });

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>No page selected</p>
      </div>
    );
  }

  const renderContent = () => {
    if (currentPage.sections.length === 0) {
      return (
        <div ref={setPageRef} data-page-id={currentPage.id} className="h-[calc(820px-86px)]">
          <div className={cn("flex flex-col items-center justify-center h-full", isPageOver ? "hidden" : "flex")}>
            <img src={images.emptyCanvas} alt="empty canvas" />
            <strong className="text-[30px]">Ready to build something great?</strong>
            <p className="text-[15px] font-medium">
              Pick a section from the left panel to start creating your website.
            </p>
          </div>
          {isPageOver && (
            <div className={cn("flex flex-col items-center justify-center h-full", isPageOver ? "block" : "hidden")}>
              <div className="mt-4 px-4 py-2 bg-[var(--color-primary)]/20 rounded text-sm font-medium text-[var(--color-primary)]">
                Drop section here
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div data-page-id={currentPage.id} className="flow-root min-h-[calc(820px-86px)]">
        <DropZone id={`page-drop-0`} data={{ pageId: currentPage.id, order: 0 }} direction="vertical" />
        {currentPage.sections.map((section, index) => (
          <React.Fragment key={section.id}>
            <SectionRenderer section={section} />
            <DropZone
              id={`page-drop-${index + 1}`}
              data={{ pageId: currentPage.id, order: index + 1 }}
              direction="vertical"
            />
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div data-page-id={currentPage.id} className="flow-root min-h-[calc(820px-86px)] relative">
      {/* Wrapper relative để chứa absolute/fixed */}
      <div style={{ position: "relative", minHeight: "100%" }}>{renderContent()}</div>
    </div>
  );
}
