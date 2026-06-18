import { useCallback } from "react";
import { builderStyles as styles } from "./Builder.styles";
import {
  CirclesFourIcon,
  SlidersIcon,
  CaretRightIcon,
  CubeFocusIcon,
  CodeIcon,
  CopySimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { usePrimitiveBlocks } from "@/components/hooks/usePrimitiveBlocks";
import { useSelectedElement } from "@/components/hooks/useSelectedElement";
import type { Block } from "@/types";
import { cn } from "@/lib/utils";
import Property from "./Properties/Property";
import Typography from "./Properties/Typography";
import Content from "./Content/Content";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/stores/editorStore";
import type { ColumnsBlock, ContainerBlock } from "@/types";
import Spacing from "./Properties/Spacing";
import Layout from "./Properties/Layout";
import Size from "./Properties/Size";
import Position from "./Properties/Position";
import Background from "./Properties/Background";
import Border from "./Properties/Border";
import Effects from "./Properties/Effects";

export default function RighPanel() {
  const { selectedBlock, selectedColumnSectionId, selectedColumn, selectionType } = useSelectedElement();

  const { blocks: primitiveBlocks } = usePrimitiveBlocks();

  const removeBlock = useEditorStore((s) => s.removeBlock);
  const removeColumn = useEditorStore((s) => s.removeColumn);

  const getBlockDisplayName = useCallback(
    (block: Block) => primitiveBlocks.find((b) => b.type === block.type)?.name ?? block.type,
    [primitiveBlocks],
  );

  const handleRemove = useCallback(() => {
    if (!selectionType) return;

    const currentPage = useEditorStore.getState().getCurrentPage();
    if (!currentPage) return;

    if (selectionType === "block" && selectedBlock) {
      for (const section of currentPage.sections) {
        if (section.blocks.some((b) => b.id === selectedBlock.id)) {
          removeBlock(section.id, selectedBlock.id);
          return;
        }
        for (const block of section.blocks) {
          if (block.type === "columns") {
            const colsBlock = block as ColumnsBlock;
            for (const col of colsBlock.children) {
              if (col.blocks.some((b) => b.id === selectedBlock.id)) {
                removeBlock(section.id, selectedBlock.id);
                return;
              }
            }
          }
          if (block.type === "container") {
            const container = block as ContainerBlock;
            if (container.children?.some((b) => b.id === selectedBlock.id)) {
              removeBlock(section.id, selectedBlock.id);
              return;
            }
          }
        }
      }
    } else if (selectionType === "column" && selectedColumn && selectedColumnSectionId) {
      removeColumn?.(selectedColumnSectionId, selectedColumn.id);
    }
  }, [selectionType, selectedBlock, selectedColumn, selectedColumnSectionId, removeBlock, removeColumn]);

  const displayName =
    selectionType === "block" && selectedBlock
      ? getBlockDisplayName(selectedBlock)
      : selectionType === "section"
        ? "Section"
        : "Column";

  const canRemove = selectionType === "block" || selectionType === "column";

  return (
    <div className="relative z-1">
      <aside className={cn(styles.lPanelContainer)}>
        <div className="p-[20px] border-b border-[var(--color-dark)]/10">
          <div className="flex items-center gap-[5px]">
            <CirclesFourIcon size={20} weight="fill" />
            <strong className="text-[13px] uppercase">{displayName}</strong>
          </div>
        </div>

        {selectionType ? (
          <div
            spellCheck={false}
            className="flex-1 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <Property title="Content" defaultOpen>
              <Content
                key={selectedBlock?.id || selectedColumn?.id || "no-selection"}
                block={selectedBlock}
                column={selectedColumn}
              />
            </Property>

            <div className="flex items-center justify-between px-[20px] pt-[20px]">
              <div
                className={cn(
                  "flex items-center w-auto h-[40px] overflow-hidden bg-[var(--color-light)] rounded-[10px]",
                  "shadow-[var(--shadow-brutalism-xs)]",
                  "border-2 border-[var(--color-dark)]",
                )}
              >
                <Button className="bg-[var(--color-primary)] !rounded-[8px] !w-[40px] !h-[40px]">
                  <CubeFocusIcon size={20} weight="fill" className="text-white" />
                </Button>
                <Button className="bg-transparent !w-[40px] !h-[40px] border-2 border-transparent">
                  <CodeIcon size={20} weight="bold" />
                </Button>
              </div>

              <div className="flex items-center gap-[5px]">
                <Button
                  className={cn(
                    "bg-[var(--color-light)] !rounded-[10px] !w-[40px] !h-[40px]",
                    "hover:bg-[var(--color-primary)] transition-all",
                    "shadow-[var(--shadow-brutalism-xs)]",
                    "border-2 border-[var(--color-dark)]",
                    "text-[var(--color-dark)] hover:text-white",
                  )}
                >
                  <CopySimpleIcon size={20} weight="fill" />
                </Button>
                {canRemove && (
                  <Button
                    onClick={handleRemove}
                    className={cn(
                      "bg-[var(--color-light)] !rounded-[10px] !w-[40px] !h-[40px]",
                      "hover:bg-[var(--color-primary)] transition-all",
                      "shadow-[var(--shadow-brutalism-xs)]",
                      "border-2 border-[var(--color-dark)]",
                      "text-[var(--color-dark)] hover:text-white",
                    )}
                  >
                    <TrashIcon size={20} weight="fill" />
                  </Button>
                )}
              </div>
            </div>

            <Property title="Typography">
              <Typography />
            </Property>
            <Property title="Layout">
              <Layout />
            </Property>
            <Property title="Spacing">
              <Spacing />
            </Property>
            <Property title="Size">
              <Size />
            </Property>
            <Property title="Position">
              <Position />
            </Property>
            <Property title="Background">
              <Background />
            </Property>
            <Property title="Border">
              <Border />
            </Property>
            <Property title="Effects">
              <Effects />
            </Property>
          </div>
        ) : (
          <>
            {["Content", "Typography", "Spacing", "Size", "Position", "Background", "Border", "Effects"].map(
              (title) => (
                <div key={title} className="border-b border-[var(--color-dark)]/10 p-[20px] flex items-center gap-2">
                  <CaretRightIcon size={16} weight="fill" className="text-[var(--color-dark)]/20" />
                  <strong className="text-[14px] text-[var(--color-dark)]/20">{title}</strong>
                </div>
              ),
            )}
          </>
        )}
      </aside>

      {!selectionType && (
        <aside className={cn("absolute z-40 top-0 right-0 w-[260px] h-screen", "bg-[var(--color-light)]/50")}>
          <div className="w-full h-full flex flex-col items-center justify-center gap-[10px]">
            <div className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-[var(--color-primary)]/20">
              <SlidersIcon size={20} weight="fill" className="text-[var(--color-primary)]" />
            </div>
            <div className="text-[14px] text-[var(--color-dark)]/70 w-[180px] text-center">
              Select an element to edit its properties.
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
