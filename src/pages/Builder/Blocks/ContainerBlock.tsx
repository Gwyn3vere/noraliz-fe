import { ContainerRenderer } from "../Render/ContainerRenderer";
import type { BlockRendererProps, ContainerBlock as ContainerBlockType } from "@/types";

export function ContainerBlock({ block, sectionId, columnId }: BlockRendererProps) {
  return <ContainerRenderer container={block as ContainerBlockType} sectionId={sectionId} columnId={columnId} />;
}
