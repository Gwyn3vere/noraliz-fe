import type { BlockRendererProps } from "@/types";
import { TextBlock } from "../Blocks/TextBlock";
import { HeadingBlock } from "../Blocks/HeadingBlock";
import { QuoteBlock } from "../Blocks/QuoteBlock";
import { ImageBlock } from "../Blocks/ImageBlock";
import { VideoBlock } from "../Blocks/VideoBlock";
import { IconBlock } from "../Blocks/IconBlock";
import { ButtonBlock } from "../Blocks/ButtonBlock";
import { FormBlock } from "../Blocks/FormBlock";
import { DividerBlock } from "../Blocks/DividerBlock";
import { SpacerBlock } from "../Blocks/SpacerBlock";
import { ColsBlock } from "../Blocks/ColsBlock";
import { MapBlock } from "../Blocks/MapBlock";
import { SocialBlock } from "../Blocks/SocialBlock";
import { DefaultBlock } from "../Blocks/DefaultBlock";
import { ContainerBlock } from "../Blocks/ContainerBlock";

export function BlockRenderer(props: BlockRendererProps) {
  const { block } = props;

  switch (block.type) {
    case "container":
      return <ContainerBlock {...props} />;

    case "text":
      return <TextBlock {...props} />;

    case "heading":
      return <HeadingBlock {...props} />;

    case "blockquote":
      return <QuoteBlock {...props} />;

    case "image":
      return <ImageBlock {...props} />;

    case "video":
      return <VideoBlock {...props} />;

    case "icon":
      return <IconBlock {...props} />;

    case "button":
      return <ButtonBlock {...props} />;

    case "form":
      return <FormBlock {...props} />;

    case "divider":
      return <DividerBlock {...props} />;

    case "spacer":
      return <SpacerBlock {...props} />;

    case "columns":
      return <ColsBlock {...props} />;

    case "map":
      return <MapBlock {...props} />;

    case "social":
      return <SocialBlock {...props} />;

    default:
      return <DefaultBlock {...props} />;
  }
}
