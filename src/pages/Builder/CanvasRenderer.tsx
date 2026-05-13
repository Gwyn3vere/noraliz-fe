import { useEditorStore } from "@/stores/editorStore";
import type { Block, Section, ColumnsBlock } from "@/types";
import { images } from "@/assets/images";
import { FloatingSectionToolbar } from "./FloatingSectionToolbar";

export function CanvasRenderer() {
  const currentProject = useEditorStore((state) => state.currentProject);
  const currentPageId = useEditorStore((state) => state.currentPageId);

  const currentPage = currentProject?.pages.find((p) => p.id === currentPageId);

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>No page selected</p>
      </div>
    );
  }

  if (currentPage.sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[780px]">
        <img src={images.emptyCanvas} alt="empty canvas" />
        <strong className="text-[30px]">Ready to build something great?</strong>
        <p className="text-[15px] font-medium">Pick a section from the left panel to start creating your website.</p>
      </div>
    );
  }

  return (
    <>
      {currentPage.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  );
}

function SectionRenderer({ section }: { section: Section }) {
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  const selectSection = useEditorStore((state) => state.selectSection);
  const isSelected = selectedSectionId === section.id;

  const sectionStyles: React.CSSProperties = {
    ...(section.props as any)?.styles,
  };

  const selectionClass = isSelected
    ? "border-[var(--color-primary)] before:absolute before:inset-0 before:bg-[var(--color-primary)]/5 before:pointer-events-none"
    : "border-transparent hover:border-[var(--color-primary)]";

  return (
    <section
      id={section.id}
      className={`relative border-2 border-dashed p-4 transition-all ${selectionClass}`}
      style={sectionStyles}
      onClick={(e) => {
        e.stopPropagation();
        selectSection(section.id);
      }}
    >
      {isSelected && (
        <FloatingSectionToolbar sectionId={section.id} order={section.order} onClose={() => selectSection(null)} />
      )}
      {section.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </section>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);
  const selectBlock = useEditorStore((state) => state.selectBlock);
  const isSelected = selectedBlockId === block.id;

  const blockStyles: React.CSSProperties = {
    ...(block as any).props?.styles,
  };

  const selectionClass = isSelected
    ? "border-[var(--color-primary)] before:absolute before:inset-0 before:bg-[var(--color-primary)]/5 before:pointer-events-none"
    : "border-transparent hover:border-[var(--color-primary)]";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(block.id);
  };

  switch (block.type) {
    // ── Typography ──
    case "text":
      return (
        <p
          className={`relative border-2 border-dashed p-2 cursor-pointer transition-all ${selectionClass}`}
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
          className={`relative border-2 border-dashed p-2 cursor-pointer transition-all font-bold ${selectionClass}`}
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
          className={`relative border-2 border-dashed p-2 cursor-pointer transition-all italic ${selectionClass}`}
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
          src={(block as any).props?.src || "https://placehold.co/600x400"}
          alt={(block as any).props?.alt || "Image"}
          className={`relative border-2 border-dashed cursor-pointer transition-all max-w-full h-auto ${selectionClass}`}
          style={blockStyles}
          onClick={handleClick}
        />
      );

    case "video":
      return (
        <div
          className={`relative border-2 border-dashed cursor-pointer transition-all ${selectionClass}`}
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
          className={`relative border-2 border-dashed cursor-pointer transition-all inline-flex ${selectionClass}`}
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
          className={`relative border-2 border-dashed cursor-pointer transition-all px-4 py-2 rounded-lg text-white ${selectionClass}`}
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
          className={`relative border-2 border-dashed p-4 cursor-pointer transition-all space-y-2 ${selectionClass}`}
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
          className={`relative border-2 border-dashed cursor-pointer transition-all ${selectionClass}`}
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
          className={`relative border-2 border-dashed cursor-pointer transition-all ${selectionClass}`}
          style={{
            height: (block as any).props?.height || "40px",
            ...blockStyles,
          }}
          onClick={handleClick}
        />
      );

    case "columns": {
      const columnsBlock = block as ColumnsBlock;
      const columnChildren = columnsBlock.children || [];
      const gap = columnsBlock.props?.gap || "24px";

      return (
        <div
          className={`relative border-2 border-dashed cursor-pointer transition-all ${selectionClass}`}
          style={{
            display: "flex",
            flexDirection: "row",
            gap: gap,
            ...blockStyles,
          }}
          onClick={handleClick}
        >
          {columnChildren.map((column) => (
            <div
              key={column.id}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {column.blocks.map((childBlock) => (
                <BlockRenderer key={childBlock.id} block={childBlock} />
              ))}
            </div>
          ))}
        </div>
      );
    }

    // ── Embed ──
    case "map":
      return (
        <div
          className={`relative border-2 border-dashed cursor-pointer transition-all w-full h-64 ${selectionClass}`}
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
          className={`relative border-2 border-dashed cursor-pointer transition-all flex gap-2 p-2 ${selectionClass}`}
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
          className={`relative border-2 border-dashed cursor-pointer transition-all p-2 ${selectionClass}`}
          style={blockStyles}
          onClick={handleClick}
        >
          <p className="text-gray-500 text-sm">{block.type}</p>
        </div>
      );
  }
}
