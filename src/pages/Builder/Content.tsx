import React from "react";
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
      return <VideoContent />;
    case "icon":
      return <IconContent />;
    case "button":
      return <ButtonContent block={block} />;
    case "form":
      return <FormContent />;
    case "divider":
      return <DividerContent />;
    case "spacer":
      return <SpacerContent />;
    case "columns":
      return <ColumnsContent block={block} />;
    case "map":
      return <MapContent />;
    case "social":
      return <SocialContent />;
    default:
      return (
        <div className="text-[12px] text-[var(--color-dark)]/40 text-center py-4">
          No content options for this block type.
        </div>
      );
  }
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

const ColumnContent = React.memo(function ColumnContent({ column: _column }: { column: ColumnBlock }) {
  // TODO: implement column editing later
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

// Placeholder components
const VideoContent = React.memo(function VideoContent() {
  return <div className="text-[12px] text-[var(--color-dark)]/30 text-center py-4">Video settings coming soon</div>;
});
const IconContent = React.memo(function IconContent() {
  return <div className="text-[12px] text-[var(--color-dark)]/30 text-center py-4">Icon settings coming soon</div>;
});
const FormContent = React.memo(function FormContent() {
  return <div className="text-[12px] text-[var(--color-dark)]/30 text-center py-4">Form settings coming soon</div>;
});
const DividerContent = React.memo(function DividerContent() {
  return <div className="text-[12px] text-[var(--color-dark)]/30 text-center py-4">Divider settings coming soon</div>;
});
const SpacerContent = React.memo(function SpacerContent() {
  return <div className="text-[12px] text-[var(--color-dark)]/30 text-center py-4">Spacer settings coming soon</div>;
});
const MapContent = React.memo(function MapContent() {
  return <div className="text-[12px] text-[var(--color-dark)]/30 text-center py-4">Map settings coming soon</div>;
});
const SocialContent = React.memo(function SocialContent() {
  return <div className="text-[12px] text-[var(--color-dark)]/30 text-center py-4">Social settings coming soon</div>;
});

export default React.memo(Content);
