import type { Block, ColumnsBlock, ContainerBlock } from "@/types";

export function updateBlockRecursive(block: Block, blockId: string, updater: (b: Block) => Block): Block {
  if (block.id === blockId) return updater(block);

  if (block.type === "columns" && "children" in block) {
    return {
      ...block,
      children: (block as ColumnsBlock).children.map((col) => ({
        ...col,
        blocks: col.blocks.map((child) => updateBlockRecursive(child, blockId, updater)),
      })),
    } as Block;
  }

  if (block.type === "container" && "children" in block) {
    return {
      ...block,
      children: (block as ContainerBlock).children.map((child) => updateBlockRecursive(child, blockId, updater)),
    } as Block;
  }

  return block;
}
