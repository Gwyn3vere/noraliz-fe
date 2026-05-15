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
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { builderStyles as styles } from "./Builder.styles";
import { useCanvasInteraction } from "@/components/hooks/useCanvasInteraction";
import { CanvasRenderer } from "./CanvasRenderer";
import { useEditorStore } from "@/stores/editorStore";
import { useDndContext } from "@dnd-kit/core";
import { CanvasContext } from "./CanvasContext";

function Canvas() {
  const [projectName, setProjectName] = useState("Project name");
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const setReorderingSection = useEditorStore((state) => state.setReorderingSection);

  const dndContext = useDndContext();
  const isDragging = !!dndContext.active;
  const reorderingSectionId = useEditorStore((state) => state.reorderingSectionId);

  const panDisabled = isDragging || reorderingSectionId !== null;

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
              className="transition-transform duration-100 ease-out origin-center rounded-[10px]"
              style={{
                width: 1440,
                height: 820,

                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom / 100})`,
              }}
              onClick={handleCanvasClick}
            >
              {/* Browser tab - url */}
              <div className="h-[30px] inline-flex gap-2 rounded-[10px] mb-2">
                <div
                  className={cn(
                    "flex items-center cursor-pointer",
                    "bg-[var(--color-light)] w-[160px] rounded-[10px] h-full",
                  )}
                >
                  <span className="px-3 font-medium text-[13px]">{currentPage.name}</span>
                </div>
                <Button className="w-[30px] h-[30px] !rounded-[10px] bg-[var(--color-dark)]/5">
                  <PlusIcon size={12} />
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
          <Button className={cn("!w-[170px]", styles.canvasButton, styles.canvasButtonHover)}>
            <ArrowSquareOutIcon size={20} weight="fill" />
            <span className={styles.canvasText}>Priview in new tab</span>
          </Button>
        </Interaction>
        <Interaction position="top-[20px] right-[40px]">
          {/* Save - Publish */}
          <Button className={cn(styles.canvasButton, styles.canvasButtonHover)}>
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
          {/* Status */}
          <div className={styles.canvasStatus}>
            <span>Saved: Just now</span>
            <span className="text-[var(--color-dark)]/20">|</span>
            <span>Page: 1</span>
          </div>
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
