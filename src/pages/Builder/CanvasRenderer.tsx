import React from "react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editorStore";
import type { Block, Section, ColumnsBlock } from "@/types";
import { images } from "@/assets/images";
import { FloatingSectionToolbar } from "./FloatingSectionToolbar";
import { useSectionDrop } from "@/components/hooks/useSectionDrop";
import { useBlockDrop } from "@/components/hooks/useBlockDrop";
import { useColumnDrop } from "@/components/hooks/useColumnDrop";
import { useBlockReorder } from "@/components/hooks/useBlockReorder";
import { useColumnReorder } from "@/components/hooks/useColumnReorder";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import { DropZone } from "./DropZone";

export function CanvasRenderer() {
  const currentProject = useEditorStore((state) => state.currentProject);
  const currentPageId = useEditorStore((state) => state.currentPageId);

  const currentPage = currentProject?.pages.find((p) => p.id === currentPageId);

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

  if (currentPage.sections.length === 0) {
    return (
      <div ref={setPageRef} data-page-id={currentPage.id} className="h-[calc(820px-86px)]">
        <div className={cn("flex flex-col items-center justify-center h-full", isPageOver ? "hidden" : "flex")}>
          <img src={images.emptyCanvas} alt="empty canvas" />
          <strong className="text-[30px]">Ready to build something great?</strong>
          <p className="text-[15px] font-medium">Pick a section from the left panel to start creating your website.</p>
        </div>
        {isPageOver && (
          <div
            className={cn("flex flex-col items-center justify-center h-full h-full", isPageOver ? "block" : "hidden")}
          >
            <div
              className={cn(
                "mt-4 px-4 py-2 bg-[var(--color-primary)]/20 rounded text-sm font-medium text-[var(--color-primary)]",
              )}
            >
              Drop section here
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div data-page-id={currentPage.id} className="h-[calc(820px-86px)]">
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
}

function SectionRenderer({ section }: { section: Section }) {
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  const selectSection = useEditorStore((state) => state.selectSection);
  const isSelected = selectedSectionId === section.id;

  const { setNodeRef, isOver } = useSectionDrop(section.id);

  const sectionStyles: React.CSSProperties = {
    ...(section.props as any)?.styles,
  };

  const selectionClass = isSelected
    ? "border-[var(--color-primary)] before:absolute before:inset-0 before:bg-[var(--color-primary)]/5 before:pointer-events-none"
    : "border-transparent hover:border-[var(--color-primary)]";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectSection(section.id);
  };

  return (
    <section
      ref={setNodeRef}
      id={section.id}
      data-section-id={section.id}
      className={`relative border-2 border-dashed p-4 transition-all ${selectionClass} ${
        isOver ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]" : ""
      }`}
      style={{
        ...sectionStyles,
        minHeight: section.blocks.length === 0 ? "120px" : undefined,
      }}
      onClick={handleClick}
    >
      {isSelected && (
        <FloatingSectionToolbar sectionId={section.id} order={section.order} onClose={() => selectSection(null)} />
      )}
      {section.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} sectionId={section.id} />
      ))}
    </section>
  );
}

function ColumnRenderer({ column, sectionId, columnsBlockId, index, total }) {
  const { setNodeRef, isOver } = useColumnDrop(column.id, sectionId, columnsBlockId);
  const reorderingSectionId = useEditorStore((s) => s.reorderingSectionId);
  const isReorderMode = reorderingSectionId === sectionId;
  const {
    listeners,
    attributes,
    setNodeRef: setColDragRef,
    isDragging,
  } = useColumnReorder(column.id, columnsBlockId, sectionId, !isReorderMode);

  const selectedColumnId = useEditorStore((state) => state.selectedColumnId);
  const selectColumn = useEditorStore((state) => state.selectColumn);
  const isSelected = selectedColumnId === column.id;

  // Lấy activeDragItem từ DnD context để check type đang kéo
  const { active } = useDndContext();
  const isDraggingColumns = active?.data.current?.blockType === "columns";

  const columnStyles: React.CSSProperties = {
    ...(column as any).props?.styles,
  };

  const selectionClass = isSelected
    ? "border-[var(--color-primary)] before:absolute before:inset-0 before:bg-[var(--color-primary)]/5 before:pointer-events-none"
    : "border-transparent hover:border-[var(--color-primary)]";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectColumn(column.id, sectionId);
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        if (isReorderMode) setColDragRef(node);
      }}
      data-column-id={column.id}
      data-columns-block-id={columnsBlockId}
      onClick={handleClick}
      style={{
        ...columnStyles,
        minHeight: "120px",
        padding: "8px",
        opacity: isDragging ? 0.4 : 1,
        cursor: isReorderMode ? "grab" : undefined,
      }}
      className={`relative border-2 border-dashed flex-1 p-4 transition-all ${selectionClass} ${
        isOver ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]" : ""
      }`}
      {...(isReorderMode ? listeners : {})}
      {...(isReorderMode ? attributes : {})}
    >
      {column.blocks.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full gap-1 pointer-events-none select-none">
          {isDraggingColumns ? (
            <span className="text-[11px] font-medium text-red-400 uppercase tracking-wide">Cannot nest columns</span>
          ) : (
            <>
              <span className="text-[11px] font-medium text-[var(--color-dark)]/30 uppercase tracking-wide">
                Column {(index ?? 0) + 1}/{total ?? "?"}
              </span>
              <span className="text-[10px] text-[var(--color-dark)]/20">Drop blocks here</span>
            </>
          )}
        </div>
      )}

      {column.blocks.map((childBlock) => (
        <BlockRenderer key={childBlock.id} block={childBlock} sectionId={sectionId} columnId={column.id} />
      ))}
    </div>
  );
}

function BlockRenderer({ block, sectionId, columnId }: { block: Block; sectionId: string; columnId?: string }) {
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);
  const selectBlock = useEditorStore((state) => state.selectBlock);
  const reorderingSectionId = useEditorStore((state) => state.reorderingSectionId);
  const isReorderMode = reorderingSectionId === sectionId;

  const isSelected = selectedBlockId === block.id;

  const { setNodeRef, isOver } = useBlockDrop(block.id, sectionId, columnId);
  const {
    listeners,
    attributes,
    setNodeRef: setDragRef,
    isDragging,
  } = useBlockReorder(block.id, sectionId, columnId, !isReorderMode);

  const blockStyles: React.CSSProperties = {
    ...(block as any).props?.styles,
  };

  const selectionClass = isSelected
    ? "border-[var(--color-primary)] before:absolute before:inset-0 before:bg-[var(--color-primary)]/5 before:pointer-events-none"
    : "border-transparent hover:border-[var(--color-primary)]";

  const dropEffect = isOver ? "bg-[var(--color-primary)]/10" : "";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(block.id);
  };

  const renderBlock = () => {
    switch (block.type) {
      // ── Typography ──
      case "text":
        return (
          <p
            data-block-id={block.id}
            className={`relative border-2 border-dashed p-2 cursor-pointer transition-all ${selectionClass} ${dropEffect}`}
            style={blockStyles}
            onClick={handleClick}
          >
            {(block as any).props?.content || "Text content"}
          </p>
        );

      case "heading": {
        const HeadingTag = (block as any).props?.level || "h2";
        return (
          <HeadingTag
            data-block-id={block.id}
            className={`relative border-2 border-dashed p-2 cursor-pointer transition-all font-bold ${selectionClass} ${dropEffect}`}
            style={blockStyles}
            onClick={handleClick}
          >
            {(block as any).props?.content || "Heading"}
          </HeadingTag>
        );
      }
      case "blockquote":
        return (
          <blockquote
            data-block-id={block.id}
            className={`relative border-2 border-dashed p-2 cursor-pointer transition-all italic ${selectionClass} ${dropEffect}`}
            style={blockStyles}
            onClick={handleClick}
          >
            {(block as any).props?.content || "Quote"}
          </blockquote>
        );

      // ── Media ──
      case "image":
        return (
          <img
            data-block-id={block.id}
            src={(block as any).props?.src || "https://placehold.co/600x400"}
            alt={(block as any).props?.alt || "Image"}
            className={`relative border-2 border-dashed cursor-pointer transition-all max-w-full h-auto ${selectionClass} ${dropEffect}`}
            style={blockStyles}
            onClick={handleClick}
          />
        );

      case "video":
        return (
          <div
            data-block-id={block.id}
            className={`relative border-2 border-dashed cursor-pointer transition-all ${selectionClass} ${dropEffect}`}
            style={blockStyles}
            onClick={handleClick}
          >
            <iframe
              src={(block as any).props?.embedUrl || ""}
              width={(block as any).props?.width || "100%"}
              height={(block as any).props?.height || "315"}
              allowFullScreen
              className="pointer-events-none"
            />
          </div>
        );

      case "icon":
        return (
          <div
            data-block-id={block.id}
            className={`relative border-2 border-dashed cursor-pointer transition-all inline-flex ${selectionClass} ${dropEffect}`}
            style={blockStyles}
            onClick={handleClick}
          >
            <svg width={(block as any).props?.size || 24} height={(block as any).props?.size || 24}>
              <circle cx="12" cy="12" r="10" fill={(block as any).props?.color || "#000"} />
            </svg>
          </div>
        );

      // ── Interactive ──
      case "button":
        return (
          <button
            data-block-id={block.id}
            className={`relative border-2 border-dashed cursor-pointer transition-all px-4 py-2 rounded-lg text-white ${selectionClass} ${dropEffect}`}
            style={{
              backgroundColor: (block as any).props?.variant === "primary" ? "var(--color-primary)" : "transparent",
              color: (block as any).props?.variant === "primary" ? "#fff" : "var(--color-dark)",
              ...blockStyles,
            }}
            onClick={handleClick}
          >
            {(block as any).props?.label || "Button"}
          </button>
        );

      case "form":
        return (
          <form
            data-block-id={block.id}
            className={`relative border-2 border-dashed p-4 cursor-pointer transition-all space-y-2 ${selectionClass} ${dropEffect}`}
            style={blockStyles}
            onClick={handleClick}
          >
            {((block as any).props?.fields as any[])?.map((field, i) => (
              <input
                key={i}
                type={field.type || "text"}
                placeholder={field.name || `Field ${i + 1}`}
                className="w-full px-3 py-2 border rounded"
                disabled
              />
            ))}
            <button type="button" className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg" disabled>
              {(block as any).props?.submitLabel || "Submit"}
            </button>
          </form>
        );

      // ── Layout ──
      case "divider":
        return (
          <hr
            data-block-id={block.id}
            className={`relative border-2 border-dashed cursor-pointer transition-all ${selectionClass} ${dropEffect}`}
            style={{
              borderColor: (block as any).props?.color || "#e5e5e5",
              borderWidth: (block as any).props?.thickness || 1,
              ...blockStyles,
            }}
            onClick={handleClick}
          />
        );

      case "spacer":
        return (
          <div
            data-block-id={block.id}
            className={`relative border-2 border-dashed cursor-pointer transition-all ${selectionClass} ${dropEffect}`}
            style={{
              height: (block as any).props?.height || "40px",
              ...blockStyles,
            }}
            onClick={handleClick}
          />
        );

      case "columns": {
        const columnsBlock = block as ColumnsBlock;
        const gap = columnsBlock.props?.gap || "24px";
        return (
          <div
            data-block-id={block.id}
            className={`relative border-2 border-dashed cursor-pointer transition-all ${selectionClass} ${dropEffect}`}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: gap,
              minHeight: "200px", // ← tăng min-height
              padding: "8px",
              ...blockStyles,
            }}
            onClick={handleClick}
          >
            {columnsBlock.children.map((column, index) => (
              <ColumnRenderer
                key={column.id}
                column={column}
                columnsBlockId={columnsBlock.id}
                sectionId={sectionId}
                index={index}
                total={columnsBlock.children.length}
              />
            ))}
          </div>
        );
      }

      // ── Embed ──
      case "map":
        return (
          <div
            data-block-id={block.id}
            className={`relative border-2 border-dashed cursor-pointer transition-all w-full h-64 ${selectionClass} ${dropEffect}`}
            style={blockStyles}
            onClick={handleClick}
          >
            <iframe
              src={(block as any).props?.embedUrl || "https://maps.google.com/maps?q=Hanoi&output=embed"}
              width="100%"
              height="100%"
              className="pointer-events-none"
            />
          </div>
        );

      case "social":
        return (
          <div
            data-block-id={block.id}
            className={`relative border-2 border-dashed cursor-pointer transition-all flex gap-2 p-2 ${selectionClass} ${dropEffect}`}
            style={blockStyles}
            onClick={handleClick}
          >
            {((block as any).props?.links as any[])?.map((link, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs"
                title={link.platform}
              >
                {link.platform?.[0]?.toUpperCase() || "?"}
              </div>
            )) || "No links"}
          </div>
        );

      default:
        return (
          <div
            data-block-id={block.id}
            className={`relative border-2 border-dashed cursor-pointer transition-all p-2 ${selectionClass} ${dropEffect}`}
            style={blockStyles}
            onClick={handleClick}
          >
            <p className="text-gray-500 text-sm">{block.type}</p>
          </div>
        );
    }
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        if (isReorderMode) setDragRef(node);
      }}
      className={cn(
        "relative group",
        isReorderMode && "cursor-grab active:cursor-grabbing ring-2 ring-[var(--color-primary)]/30",
      )}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      onClick={handleClick}
      {...(isReorderMode ? listeners : {})}
      {...(isReorderMode ? attributes : {})}
    >
      {renderBlock()}
    </div>
  );
}
