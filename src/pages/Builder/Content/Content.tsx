import React from "react";
import type { Block, ColumnBlock } from "@/types";
import TextContent from "./TextContent";
import HeadingContent from "./HeadingContent";
import ImageContent from "./ImageContent";
import ButtonContent from "./ButtonContent";
import ColumnsContent from "./ColumnsContent";
import VideoContent from "./VideoContent";
import IconContent from "./IconContent";
import FormContent from "./FormContent";
import DividerContent from "./DividerContent";
import SpacerContent from "./SpacerContent";
import MapContent from "./MapContent";
import SocialContent from "./SocialContent";
import ColumnContent from "./ColumnContent";
import ContainerContent from "./ContainerContent";

interface ContentProps {
  block: Block | null;
  column: ColumnBlock | null;
}

function Content({ block, column }: ContentProps) {
  if (column) return <ColumnContent column={column} />;
  if (!block) return null;

  switch (block.type) {
    case "container":
      return <ContainerContent />;
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

export default React.memo(Content);
