import React, { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editorStore";
import type { Block, Section, ColumnsBlock, ButtonBlock } from "@/types";
import { images } from "@/assets/images";
import { FloatingSectionToolbar } from "./FloatingSectionToolbar";
import { useSectionDrop } from "@/components/hooks/useSectionDrop";
import { useBlockDrop } from "@/components/hooks/useBlockDrop";
import { useColumnDrop } from "@/components/hooks/useColumnDrop";
import { useBlockReorder } from "@/components/hooks/useBlockReorder";
import { useColumnReorder } from "@/components/hooks/useColumnReorder";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import { DropZone } from "./DropZone";
import { useInlineEdit } from "@/components/hooks/useInlineEdit";

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
    <div data-page-id={currentPage.id} className="min-h-[calc(820px-86px)]">
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
  const [isHovered, setIsHovered] = useState(false);

  const { setNodeRef, isOver } = useSectionDrop(section.id);

  const sectionStyles: React.CSSProperties = {
    ...(section.props as any)?.styles,
  };

  const showOutline = isHovered || isSelected;
  const editorClasses = cn(
    "relative p-4 transition-all outline outline-2 outline-dashed",
    showOutline ? "outline-[var(--color-primary)]" : "outline-transparent",
    isSelected ? "before:absolute before:inset-0 before:bg-[var(--color-primary)]/5 before:pointer-events-none" : "",
    isOver ? "bg-[var(--color-primary)]/10" : "",
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectSection(section.id);
  };

  return (
    <section
      ref={setNodeRef}
      id={section.id}
      data-section-id={section.id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={editorClasses}
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

function ColumnRenderer({
  column,
  sectionId,
  columnsBlockId,
  index,
  total,
}: {
  column: ColumnsBlock["children"][0];
  sectionId: string;
  columnsBlockId: string;
  index?: number;
  total?: number;
}) {
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
  const [isHovered, setIsHovered] = useState(false);

  const { active } = useDndContext();
  const isDraggingColumns = active?.data.current?.blockType === "columns";

  const columnStyles: React.CSSProperties = {
    ...(column as any).props?.styles,
  };

  const showOutline = isHovered || isSelected;
  const editorClasses = cn(
    "relative flex-1 p-4 transition-all outline outline-2 outline-dashed",
    showOutline ? "outline-[var(--color-primary)]" : "outline-transparent",
    isSelected ? "before:absolute before:inset-0 before:bg-[var(--color-primary)]/5 before:pointer-events-none" : "",
    isOver ? "bg-[var(--color-primary)]/10" : "",
  );

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...columnStyles,
        minHeight: "120px",
        padding: "8px",
        opacity: isDragging ? 0.4 : 1,
        cursor: isReorderMode ? "grab" : undefined,
      }}
      className={editorClasses}
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

  const { isEditing, contentRef, handleDoubleClick, handleBlur, handleKeyDown } = useInlineEdit(block);

  const [isHovered, setIsHovered] = useState(false);

  const { setNodeRef: setDropRef, isOver } = useBlockDrop(block.id, sectionId, columnId);

  const {
    listeners,
    attributes,
    setNodeRef: setDragRef,
    isDragging,
  } = useBlockReorder(block.id, sectionId, columnId, !isReorderMode);

  const combinedRef = useCallback(
    (node: HTMLElement | null) => {
      setDropRef(node);

      if (isReorderMode) {
        setDragRef(node);
      }
    },
    [setDropRef, setDragRef, isReorderMode],
  );

  const blockStyles: React.CSSProperties = {
    ...(block as any).props?.styles,
    opacity: isDragging ? 0.4 : 1,
  };

  const userClasses = (block as any).classes?.join(" ") || "";

  const showOutline = isHovered || isSelected;

  const editorClasses = cn(
    "relative cursor-pointer transition-all outline outline-2 outline-dashed",
    showOutline ? "outline-[var(--color-primary)]" : "outline-transparent",
    isSelected ? "before:absolute before:inset-0 before:bg-[var(--color-primary)]/5 before:pointer-events-none" : "",
    isOver ? "bg-[var(--color-primary)]/10" : "",
    isReorderMode ? "cursor-grab active:cursor-grabbing ring-2 ring-[var(--color-primary)]/30" : "",
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(block.id);
  };

  const baseProps = {
    onClick: handleClick,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  const dragProps = isReorderMode
    ? {
        ...listeners,
        ...attributes,
      }
    : {};

  const interactionProps = {
    ...baseProps,
    ...dragProps,
  };

  switch (block.type) {
    case "text":
      return (
        <p
          ref={(node) => {
            combinedRef(node);
            contentRef.current = node;
          }}
          data-block-id={block.id}
          {...interactionProps}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onDoubleClick={handleDoubleClick}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={blockStyles}
          className={cn(userClasses, editorClasses, isEditing && "cursor-text outline-none")}
        >
          {(block as any).props?.content || "Text content"}
        </p>
      );

    case "heading": {
      const level = (block as any).props?.level || "h2";

      const HeadingTag = level as React.ElementType;

      const headingSizes: Record<string, string> = {
        h1: "text-4xl font-extrabold",
        h2: "text-3xl font-bold",
        h3: "text-2xl font-bold",
        h4: "text-xl font-semibold",
        h5: "text-lg font-semibold",
        h6: "text-base font-semibold",
      };

      return (
        <HeadingTag
          ref={combinedRef as any}
          data-block-id={block.id}
          {...interactionProps}
          style={blockStyles}
          className={cn(userClasses, editorClasses, headingSizes[level], "leading-tight tracking-tight")}
        >
          {(block as any).props?.content || "Heading"}
        </HeadingTag>
      );
    }

    case "blockquote":
      return (
        <blockquote
          ref={combinedRef as React.Ref<HTMLQuoteElement>}
          data-block-id={block.id}
          {...interactionProps}
          style={blockStyles}
          className={cn(userClasses, editorClasses, "italic")}
        >
          {(block as any).props?.content || "Quote"}
        </blockquote>
      );

    case "image":
      return (
        <img
          ref={combinedRef as React.Ref<HTMLImageElement>}
          data-block-id={block.id}
          {...interactionProps}
          src={(block as any).props?.src || "https://placehold.co/600x400"}
          alt={(block as any).props?.alt || "Image"}
          className={cn(userClasses, editorClasses, "max-w-full h-auto")}
          style={{
            ...blockStyles,
            objectFit: (block as any).props?.objectFit || "cover",
          }}
        />
      );

    case "video":
      return (
        <div
          ref={combinedRef as React.Ref<HTMLDivElement>}
          data-block-id={block.id}
          {...interactionProps}
          style={blockStyles}
          className={cn(userClasses, editorClasses)}
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
          ref={combinedRef as React.Ref<HTMLDivElement>}
          data-block-id={block.id}
          {...interactionProps}
          style={blockStyles}
          className={cn(userClasses, editorClasses, "inline-flex")}
        >
          <svg width={(block as any).props?.size || 24} height={(block as any).props?.size || 24}>
            <circle cx="12" cy="12" r="10" fill={(block as any).props?.color || "#000"} />
          </svg>
        </div>
      );

    case "button": {
      const btnBlock = block as ButtonBlock;

      const rawHref = btnBlock.props?.href;

      const href = typeof rawHref === "string" ? rawHref.trim() : "";

      const label = btnBlock.props?.label || "Button";

      if (href) {
        return (
          <a
            ref={combinedRef as React.Ref<HTMLAnchorElement>}
            data-block-id={block.id}
            {...interactionProps}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={blockStyles}
            className={cn(userClasses, editorClasses)}
            onClick={(e) => {
              e.preventDefault();
              handleClick(e);
            }}
          >
            {label}
          </a>
        );
      }

      return (
        <button
          ref={combinedRef as React.Ref<HTMLButtonElement>}
          data-block-id={block.id}
          {...interactionProps}
          type="button"
          style={blockStyles}
          className={cn(userClasses, editorClasses)}
        >
          {label}
        </button>
      );
    }

    case "form":
      return (
        <form
          ref={combinedRef as React.Ref<HTMLFormElement>}
          data-block-id={block.id}
          {...interactionProps}
          style={blockStyles}
          className={cn(userClasses, editorClasses, "space-y-2")}
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

    case "divider":
      return (
        <hr
          ref={combinedRef as React.Ref<HTMLHRElement>}
          data-block-id={block.id}
          {...interactionProps}
          className={cn(userClasses, editorClasses)}
          style={{
            borderColor: (block as any).props?.color || "#e5e5e5",
            borderWidth: (block as any).props?.thickness || 1,
            ...blockStyles,
          }}
        />
      );

    case "spacer":
      return (
        <div
          ref={combinedRef as React.Ref<HTMLDivElement>}
          data-block-id={block.id}
          {...interactionProps}
          className={cn(userClasses, editorClasses)}
          style={{
            width: (block as any).props?.width || "100%",
            height: (block as any).props?.height || "40px",
            ...blockStyles,
          }}
        />
      );

    case "columns": {
      const columnsBlock = block as ColumnsBlock;

      const gap = columnsBlock.props?.gap || "24px";

      return (
        <div
          ref={combinedRef as React.Ref<HTMLDivElement>}
          data-block-id={block.id}
          {...interactionProps}
          className={cn(userClasses, editorClasses)}
          style={{
            display: "flex",
            flexDirection: "row",
            gap,
            minHeight: "200px",
            padding: "8px",
            ...blockStyles,
          }}
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

    case "map":
      return (
        <div
          ref={combinedRef as React.Ref<HTMLDivElement>}
          data-block-id={block.id}
          {...interactionProps}
          style={blockStyles}
          className={cn(userClasses, editorClasses, "w-full h-64")}
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
          ref={combinedRef as React.Ref<HTMLDivElement>}
          data-block-id={block.id}
          {...interactionProps}
          style={blockStyles}
          className={cn(userClasses, editorClasses, "flex gap-2")}
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
          ref={combinedRef as React.Ref<HTMLDivElement>}
          data-block-id={block.id}
          {...interactionProps}
          style={blockStyles}
          className={cn(userClasses, editorClasses)}
        >
          <p className="text-gray-500 text-sm">{block.type}</p>
        </div>
      );
  }
}
