import React, { useState, useCallback, useEffect } from "react";
import {
  ArrowUUpLeftIcon,
  ArrowUUpRightIcon,
  FolderOpenIcon,
  ArrowSquareOutIcon,
  UploadIcon,
  BookOpenTextIcon,
  WrenchIcon,
  DesktopIcon,
  DeviceTabletSpeakerIcon,
  DeviceMobileSpeakerIcon,
  ArrowsOutIcon,
  StackIcon,
  PlusIcon,
  MinusIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretDownIcon,
  ArrowClockwiseIcon,
  GearIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { builderStyles as styles } from "./Builder.styles";
import { useCanvasInteraction } from "@/components/hooks/useCanvasInteraction";
import { useAutoSave } from "@/components/hooks/useAutoSave";
import { CanvasRenderer } from "./Render/CanvasRenderer";
import { useEditorStore } from "@/stores/editorStore";
import { useDndContext } from "@dnd-kit/core";
import { CanvasContext } from "./CanvasContext";
import { StatusBar } from "./StatusBar";

function Canvas() {
  const [projectName, setProjectName] = useState("Project name");
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const setReorderingSection = useEditorStore((state) => state.setReorderingSection);

  const { performSave, isSaving, lastSavedAt, isDirty } = useAutoSave();

  const currentPageId = useEditorStore((state) => state.currentPageId);
  const currentProject = useEditorStore((state) => state.currentProject);
  const setCurrentPage = useEditorStore((state) => state.setCurrentPage);
  const addPage = useEditorStore((state) => state.addPage);
  const removePage = useEditorStore((state) => state.removePage);
  const pages = currentProject?.pages ?? [];

  const dndContext = useDndContext();
  const isDragging = !!dndContext.active;
  const reorderingSectionId = useEditorStore((state) => state.reorderingSectionId);

  const isInlineEditing = useEditorStore((s) => s.isInlineEditing);
  const panDisabled = isDragging || reorderingSectionId !== null || isInlineEditing;

  const currentPage = useEditorStore((state) => state.getCurrentPage());

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>No page selected</p>
      </div>
    );
  }

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      // Chỉ clear selection khi click trực tiếp vào vùng canvas (không phải vào section/block)
      if (e.target === e.currentTarget) {
        clearSelection();
      }
    },
    [clearSelection],
  );

  const {
    zoom,
    panOffset,
    isPanning,
    canvasRef,
    handleZoomIn,
    handleZoomOut,
    handleFit,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useCanvasInteraction(100, panDisabled);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearSelection();
        setReorderingSection(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <CanvasContext.Provider value={{ panOffset, zoom }}>
      <div id="builder-canvas" className="relative flex-1 px-[40px] h-screen overflow-hidden">
        <div
          ref={canvasRef}
          className={cn("h-full", isPanning ? "cursor-grabbing" : "cursor-grab")}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="h-screen flex items-center justify-center" onClick={handleCanvasClick}>
            <div
              className={cn("origin-center rounded-[10px]", !isPanning && "transition-transform duration-300 ease-out")}
              style={{
                width: 1440,
                height: 820,

                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom / 100})`,
              }}
              onClick={handleCanvasClick}
            >
              {/* Browser tab - url */}
              <div className="h-[30px] inline-flex gap-2 rounded-[10px] mb-2">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    onClick={() => setCurrentPage(page.id)}
                    className={cn(
                      "flex items-center justify-between cursor-pointer w-[160px] rounded-[10px] h-full",
                      page.id === currentPageId
                        ? "bg-[var(--color-light)] text-[var(--color-dark)] font-medium"
                        : "bg-[var(--color-dark)]/5 text-[var(--color-dark)]/50 hover:bg-[var(--color-dark)]/10",
                    )}
                  >
                    <span className="px-3 font-medium text-[13px]">{page.name}</span>

                    {pages.length > 1 && (
                      <Button
                        className={cn(
                          "w-[20px] h-[20px] mr-1 text-[9px] !rounded-full hover:bg-[var(--color-dark)]/10",
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          removePage(page.id);
                        }}
                      >
                        <XIcon size={11} weight="bold" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  className={cn(
                    "w-[30px] h-[30px] text-[10px] !rounded-[10px] bg-[var(--color-dark)]/5",
                    "hover:bg-[var(--color-dark)]/10",
                  )}
                  onClick={addPage}
                >
                  <PlusIcon size={10} />
                </Button>
              </div>
              <div
                className={cn(
                  "relative h-[40px] flex items-center bg-[var(--color-light)] rounded-t-[10px] px-2",
                  "border-b border-[var(--color-dark)]/5",
                )}
              >
                {/* Left */}
                <div className="flex items-center">
                  <Button className="h-[40px] w-[40px]">
                    <CaretLeftIcon size={20} weight="bold" />
                  </Button>

                  <Button className="h-[40px] w-[40px]">
                    <CaretRightIcon size={20} weight="bold" />
                  </Button>

                  <Button className="h-[40px] w-[40px]">
                    <ArrowClockwiseIcon size={20} weight="bold" />
                  </Button>
                </div>

                {/* Center */}
                <div className="absolute left-1/2 -translate-x-1/2">
                  <div
                    className={cn(
                      "flex items-center px-2",
                      "w-[560px] h-[40px] border-5 border-[var(--color-light)] bg-[var(--color-dark)]/5 rounded-[10px]",
                    )}
                  >
                    <SlidersHorizontalIcon size={16} weight="bold" />
                    <div className="flex-1 text-[13px] font-medium px-2">{currentPage.slug}</div>
                    <CaretDownIcon size={16} weight="bold" />
                  </div>
                </div>

                {/* Right */}
                <div className="ml-auto">
                  <Button className="h-[40px] w-[40px]">
                    <GearIcon size={20} weight="fill" />
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-b-[10px]" style={{ minHeight: "auto" }}>
                <CanvasRenderer />
              </div>
            </div>
          </div>
        </div>

        <Interaction position="top-[20px] left-[40px]">
          {/* Undo - Redo */}
          <Button className={cn(styles.canvasButton, styles.canvasButtonHover)}>
            <ArrowUUpLeftIcon size={20} weight="bold" />
          </Button>
          <Button className={cn(styles.canvasButton, styles.canvasButtonHover)}>
            <ArrowUUpRightIcon size={20} weight="bold" />
          </Button>

          {/*Project name input */}
          <div className={"relative"}>
            <FolderOpenIcon size={20} weight="fill" className={styles.canvasProjectIcon} />
            <Input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className={styles.canvasProjectInput}
            />
          </div>

          {/* Preview */}
          <Button
            className={cn("!w-[170px]", styles.canvasButton, styles.canvasButtonHover)}
            onClick={() => {
              if (currentProject) {
                window.open(`/preview/${currentProject.id}`, "_blank");
              }
            }}
          >
            <ArrowSquareOutIcon size={20} weight="fill" />
            <span className={styles.canvasText}>Priview in new tab</span>
          </Button>
        </Interaction>
        <Interaction position="top-[20px] right-[40px]">
          {/* Save - Publish */}
          <Button onClick={performSave} className={cn(styles.canvasButton, styles.canvasButtonHover)}>
            <UploadIcon size={20} weight="fill" />
          </Button>
          <Button className={cn(styles.canvasButton, styles.canvasButtonHover)}>
            <BookOpenTextIcon size={20} weight="fill" />
          </Button>

          {/* Export */}
          <Button className={cn(styles.canvasButton, styles.canvasButtonBorder)}>
            <span className={cn(styles.canvasText, "text-white")}>Export project</span>
          </Button>

          {/* Tooltip */}
          <Button className={cn(styles.canvasButton, styles.canvasButtonHover)}>
            <WrenchIcon size={20} weight="fill" />
          </Button>
        </Interaction>
        <Interaction position="bottom-[20px] left-[40px]">
          <StatusBar isSaving={isSaving} lastSavedAt={lastSavedAt} isDirty={isDirty} />
        </Interaction>
        <Interaction position="bottom-[20px] left-1/2 -translate-x-1/2">
          {/* View mode */}
          <div className={cn(styles.canvasButton, styles.canvasViewMode)}>
            <Button className={cn(styles.canvasButtonView, styles.canvasButton, "!bg-[var(--color-primary)]")}>
              <DesktopIcon size={20} weight="fill" className="text-white" />
            </Button>
            <Button className={cn(styles.canvasButton, styles.canvasButtonView, styles.canvasButtonHover)}>
              <DeviceTabletSpeakerIcon size={20} weight="fill" />
            </Button>
            <Button className={cn(styles.canvasButton, styles.canvasButtonView, styles.canvasButtonHover)}>
              <DeviceMobileSpeakerIcon size={20} weight="fill" />
            </Button>
          </div>
        </Interaction>
        <Interaction position="bottom-[20px] right-[40px]">
          {/* Layer */}
          <Button className={cn(styles.canvasButton, styles.canvasButtonHover)}>
            <StackIcon size={20} weight="fill" />
          </Button>

          {/* Zoom bar */}
          <div className={styles.canvasZoombar}>
            <Button
              onClick={handleZoomOut}
              className={cn(styles.canvasButton, styles.canvasButtonHover, "!shadow-none")}
            >
              <MinusIcon size={20} />
            </Button>

            <Input type="text" value={`${zoom}%`} readOnly className="!w-[60px] !h-[40px] border-none text-center" />

            <Button
              onClick={handleZoomIn}
              className={cn(styles.canvasButton, styles.canvasButtonHover, "!shadow-none")}
            >
              <PlusIcon size={20} />
            </Button>
          </div>

          {/* Fit - Fullscreen */}
          <Button className={cn(styles.canvasButton, styles.canvasButtonHover)}>
            <ArrowsOutIcon size={20} weight="fill" />
          </Button>
          <Button onClick={handleFit} className={cn(styles.canvasButton, styles.canvasButtonHover)}>
            <span className={styles.canvasText}>Fit</span>
          </Button>
        </Interaction>
      </div>
    </CanvasContext.Provider>
  );
}

export default React.memo(Canvas);

function Interaction({ position, children }: { position?: string; children?: React.ReactNode }) {
  return <div className={cn(styles.canvasInteraction, position)}>{children}</div>;
}
