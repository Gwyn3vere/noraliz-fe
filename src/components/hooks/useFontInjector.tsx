import { useEffect } from "react";
import { fontRegistry } from "@/lib/fontRegistry";
import type { Section, Block, ColumnsBlock } from "@/types";

function collectFontsFromSections(sections: Section[]): string[] {
  const fonts = new Set<string>();

  function scanBlock(block: Block) {
    const f = (block as any).props?.styles?.fontFamily;
    if (f) fonts.add(f);
    if (block.type === "columns" && "children" in block) {
      (block as ColumnsBlock).children.forEach((col) => col.blocks.forEach(scanBlock));
    }
  }

  sections.forEach((section) => {
    const sf = (section as any).props?.styles?.fontFamily;
    if (sf) fonts.add(sf);
    section.blocks.forEach(scanBlock);
  });

  return [...fonts];
}

export function useFontInjector(sections: Section[] | undefined) {
  useEffect(() => {
    if (!sections || sections.length === 0) return;

    const fonts = collectFontsFromSections(sections);
    if (fonts.length === 0) return;

    // Non-blocking — không await
    fontRegistry.preloadFonts(fonts);
  }, [sections]);
}
