import React, { useCallback } from "react";
import { useEditorStore } from "@/stores/editorStore";
import type { Block, ColumnBlock } from "@/types";
import { Label } from "@/components/ui/label";
import TextContent from "./Content/TextContent";
import HeadingContent from "./Content/HeadingContent";
import ImageContent from "./Content/ImageContent";
import ButtonContent from "./Content/ButtonContent";
import ColumnsContent from "./Content/ColumnsContent";

interface ContentProps {
  block: Block | null;
  column: ColumnBlock | null;
}

function Content({ block, column }: ContentProps) {
  if (column) return <ColumnContent column={column} />;
  if (!block) return null;

  switch (block.type) {
    case "text":
    case "blockquote":
      return <TextContent block={block} />;
    case "heading":
      return <HeadingContent block={block} />;
    case "image":
      return <ImageContent block={block} />;
    case "video":
      return <VideoContent block={block} />;
    case "icon":
      return <IconContent block={block} />;
    case "button":
      return <ButtonContent block={block} />;
    case "form":
      return <FormContent block={block} />;
    case "divider":
      return <DividerContent block={block} />;
    case "spacer":
      return <SpacerContent block={block} />;
    case "columns":
      return <ColumnsContent block={block} />;
    case "map":
      return <MapContent block={block} />;
    case "social":
      return <SocialContent block={block} />;
    default:
      return (
        <div className="text-[12px] text-[var(--color-dark)]/40 text-center py-4">
          No content options for this block type.
        </div>
      );
  }
}

// ─── Helper: update block props ──────────────────────────────────────────────

function useBlockUpdater(blockId: string) {
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

// ─── Shared UI ────────────────────────────────────────────────────────────────

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <Label className="text-[11px] font-medium text-[var(--color-dark)]/50 uppercase tracking-wide">{label}</Label>
      {children}
    </div>
  );
}

function ContentWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-[14px]">{children}</div>;
}

const ColumnContent = React.memo(function ColumnContent({ column }: { column: ColumnBlock }) {
  const updateBlock = useEditorStore((s) => s.updateBlock);

  // Column không có updateBlock trực tiếp vì không phải Block
  // Cần updateColumnProps action trong store — tạm thời để placeholder
  // TODO: thêm updateColumn action vào store

  return (
    <ContentWrapper>
      <FieldRow label="Direction">
        <div className="flex gap-[6px]">
          {(["column", "row"] as const).map((dir) => (
            <button
              key={dir}
              className="flex-1 h-[30px] rounded-md text-[11px] font-medium border border-[var(--color-dark)]/20 text-[var(--color-dark)]/60 hover:border-[var(--color-primary)] transition-colors capitalize"
            >
              {dir === "column" ? "↕ Vertical" : "↔ Horizontal"}
            </button>
          ))}
        </div>
      </FieldRow>

      <div className="text-[11px] text-[var(--color-dark)]/30 text-center py-2">
        More layout controls in Spacing section
      </div>
    </ContentWrapper>
  );
});
const VideoContent = React.memo(function TextContent({ block }: { block: Block }) {
  return <div></div>;
});
const IconContent = React.memo(function TextContent({ block }: { block: Block }) {
  return <div></div>;
});
const FormContent = React.memo(function TextContent({ block }: { block: Block }) {
  return <div></div>;
});
const DividerContent = React.memo(function TextContent({ block }: { block: Block }) {
  return <div></div>;
});
const SpacerContent = React.memo(function TextContent({ block }: { block: Block }) {
  return <div></div>;
});
const MapContent = React.memo(function TextContent({ block }: { block: Block }) {
  return <div></div>;
});
const SocialContent = React.memo(function TextContent({ block }: { block: Block }) {
  return <div></div>;
});

export default React.memo(Content);
