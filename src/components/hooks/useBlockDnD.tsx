import { useState, useCallback } from "react";
import { useSensor, useSensors, PointerSensor, pointerWithin } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent, DragOverEvent } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import { useEditorStore } from "@/stores/editorStore";
import type { PrimitiveBlock, Section, Block, ColumnBlock, ColumnsBlock } from "@/types";

interface UseBlockDnDProps {
  primitiveBlocks: PrimitiveBlock[];
}

// ─── Helpers: tính order từ pointer ───────────────────────────────────────────

function getBlockOrderFromPointer(sectionId: string, clientX: number, clientY: number): number {
  const blockElements = document.querySelectorAll(`[data-section-id="${sectionId}"] [data-block-id]`);
  if (blockElements.length === 0) return 0;

  const blocksArray = Array.from(blockElements);
  const sectionEl = document.querySelector(`[data-section-id="${sectionId}"]`);
  const isHorizontal = ["row", "row-reverse"].includes(window.getComputedStyle(sectionEl!).flexDirection);

  for (let i = 0; i < blocksArray.length; i++) {
    const rect = blocksArray[i].getBoundingClientRect();
    const pivot = isHorizontal ? rect.left : rect.top;
    const pointer = isHorizontal ? clientX : clientY;
    if (pointer < pivot) return i;
  }
  return blocksArray.length;
}

function getBlockOrderInColumn(columnId: string, clientX: number, clientY: number): number {
  const blockElements = document.querySelectorAll(`[data-column-id="${columnId}"] [data-block-id]`);
  if (blockElements.length === 0) return 0;

  const blocksArray = Array.from(blockElements);
  const columnEl = document.querySelector(`[data-column-id="${columnId}"]`);
  const isHorizontal = ["row", "row-reverse"].includes(window.getComputedStyle(columnEl!).flexDirection);

  for (let i = 0; i < blocksArray.length; i++) {
    const rect = blocksArray[i].getBoundingClientRect();
    const pivot = isHorizontal ? rect.left : rect.top;
    const pointer = isHorizontal ? clientX : clientY;
    if (pointer < pivot + (isHorizontal ? rect.width : rect.height) / 2) return i;
  }
  return blocksArray.length;
}

function getSectionOrderFromPointer(pageId: string, clientY: number): number {
  const sectionElements = document.querySelectorAll(`[data-page-id="${pageId}"] [data-section-id]`);
  if (sectionElements.length === 0) return 0;

  const sectionsArray = Array.from(sectionElements);
  for (let i = 0; i < sectionsArray.length; i++) {
    const rect = sectionsArray[i].getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) return i;
  }
  return sectionsArray.length;
}

// ─── Helper: tính drop point từ event ────────────────────────────────────────

function getDropPoint(event: DragEndEvent): { dropX: number; dropY: number } {
  const activatorX = (event.activatorEvent as MouseEvent)?.clientX ?? 0;
  const activatorY = (event.activatorEvent as MouseEvent)?.clientY ?? 0;
  return {
    dropX: activatorX + event.delta.x,
    dropY: activatorY + event.delta.y,
  };
}

// ─── Helper: tạo block mới ────────────────────────────────────────────────────

function buildBlock(blockType: string, order: number, defaultProps: Record<string, unknown>): Block {
  const isColumns = blockType === "columns";
  const count = isColumns ? (defaultProps.count as number) || 2 : 0;

  const base = {
    id: uuidv4(),
    type: blockType,
    order,
    defaultClass: `block-${uuidv4()}`,
    classes: [] as string[],
    props: defaultProps,
  };

  if (!isColumns) return base as unknown as Block;

  const children: ColumnBlock[] = Array.from({ length: count }, (_, i) => ({
    id: uuidv4(),
    type: "column" as const,
    order: i,
    blocks: [],
  }));

  return { ...base, children } as unknown as Block;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBlockDnD({ primitiveBlocks }: UseBlockDnDProps) {
  const [activeDragItem, setActiveDragItem] = useState<string | null>(null);
  const [activeDragKind, setActiveDragKind] = useState<string | null>(null);
  const [activeDragData, setActiveDragData] = useState<Record<string, any> | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

  const getBlockById = useCallback(
    (id: string): PrimitiveBlock | null => {
      return primitiveBlocks.find((b) => b.id === id) || null;
    },
    [primitiveBlocks],
  );

  const getBlockInfo = useCallback(
    (blockType: string): PrimitiveBlock | null => {
      const found =
        primitiveBlocks.find((b) => b.type === blockType && b.variant === "default") ||
        primitiveBlocks.find((b) => b.type === blockType);
      return found || null;
    },
    [primitiveBlocks],
  );

  const getDefaultPropsForType = useCallback(
    (blockType: string, variant?: string): Record<string, unknown> => {
      const block = primitiveBlocks.find(
        (b) => b.type === blockType && (variant ? b.variant === variant : b.variant === "default"),
      );
      if (!block) return {};
      try {
        return typeof block.defaultProps === "string" ? JSON.parse(block.defaultProps) : block.defaultProps;
      } catch {
        return {};
      }
    },
    [primitiveBlocks],
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragItem(event.active.id as string);
    setActiveDragKind(event.active.data.current?.kind ?? null);
    setActiveDragData(event.active.data.current ?? null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDragItem(null);
      setActiveDragKind(null);

      const { active, over } = event;
      if (!over) return;

      const blockType: string = active.data.current?.blockType;
      const blockId: string = active.data.current?.blockId;
      const kind: string = active.data.current?.kind;

      const { dropX, dropY } = getDropPoint(event);
      const store = useEditorStore.getState();

      // ── Reorder SECTION ──
      if (kind === "reorder-section") {
        const { sectionId } = active.data.current;
        const currentPage = store.getCurrentPage();
        if (!currentPage) return;

        const fromIndex = currentPage.sections.findIndex((s) => s.id === sectionId);
        const toIndex = getSectionOrderFromPointer(store.currentPageId!, dropY);

        if (fromIndex !== -1 && fromIndex !== toIndex) {
          store.reorderSections(fromIndex, toIndex);
        }
        return;
      }

      // ── Reorder BLOCK ──
      if (kind === "reorder-block" || kind === "reorder-column-block") {
        return;
      }

      if (kind === "reorder-column-block") {
        const { blockId: reorderBlockId, sectionId: sourceSectionId, columnId: sourceColumnId } = active.data.current;
        const targetColumnId = over.data.current?.columnId;
        const targetSectionId = over.data.current?.sectionId;

        if (!targetColumnId || !targetSectionId) return;

        const currentPage = store.getCurrentPage();
        const section = currentPage?.sections.find((s) => s.id === sourceSectionId);
        const colsBlock = section?.blocks.find(
          (b) => b.type === "columns" && (b as ColumnsBlock).children.some((c) => c.id === sourceColumnId),
        ) as ColumnsBlock | undefined;

        if (!colsBlock) return;

        const sourceCol = colsBlock.children.find((c) => c.id === sourceColumnId);
        if (!sourceCol) return;

        const fromIndex = sourceCol.blocks.findIndex((b) => b.id === reorderBlockId);
        if (fromIndex === -1) return;

        if (sourceColumnId === targetColumnId) {
          // Reorder trong cùng column
          const toIndex = getBlockOrderInColumn(targetColumnId, dropX, dropY);
          if (fromIndex !== toIndex) {
            store.reorderBlockInColumn(sourceSectionId, sourceColumnId, fromIndex, toIndex);
          }
        } else {
          // Move sang column khác
          const toIndex = getBlockOrderInColumn(targetColumnId, dropX, dropY);
          store.moveBlockBetweenColumns(sourceSectionId, sourceColumnId, targetColumnId, reorderBlockId, toIndex);
        }
        return;
      }

      if (!blockType) return;

      // ── Drop SECTION ──────────────────────────────────────────────────────
      if (kind === "section") {
        const { currentPageId } = store;
        if (!currentPageId) return;

        // Nếu drop vào DropZone → dùng order từ data
        const dropZoneOrder = over.data.current?.order;
        const isDropZone = over.data.current?.pageId !== undefined;

        const order = isDropZone ? dropZoneOrder : getSectionOrderFromPointer(currentPageId, dropY);
        const newSection: Section = {
          id: uuidv4(),
          templateId: blockType,
          order,
          props: {},
          blocks: [],
        };
        store.addSection(newSection, order);
        return;
      }

      // ── Drop BLOCK ────────────────────────────────────────────────────────
      const targetSectionId = over.data.current?.sectionId;
      if (!targetSectionId) {
        if (over.data.current?.pageId) {
          console.warn("Cannot drop block outside a section");
        }
        return;
      }

      const blockApi = blockId ? getBlockById(blockId) : null;
      const variant = active.data.current?.variant;

      const defaultProps = blockApi
        ? typeof blockApi.defaultProps === "string"
          ? JSON.parse(blockApi.defaultProps)
          : blockApi.defaultProps
        : getDefaultPropsForType(blockType, variant);

      const isColumn: boolean = over.data.current?.isColumn ?? false;
      const columnId: string | undefined = over.data.current?.columnId;

      if (isColumn && columnId) {
        if (blockType === "columns") return;

        const order = getBlockOrderInColumn(columnId, dropX, dropY);
        const newBlock = buildBlock(blockType, order, defaultProps);
        store.addBlockToColumn(targetSectionId, columnId, newBlock, order);
        return;
      }

      const order = getBlockOrderFromPointer(targetSectionId, dropX, dropY);
      const newBlock = buildBlock(blockType, order, defaultProps);
      store.addBlock(targetSectionId, newBlock, order);
    },
    [getBlockById, getDefaultPropsForType],
  );

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const kind = active.data.current?.kind;
    if (kind !== "reorder-block" && kind !== "reorder-column-block" && kind !== "reorder-column") return;

    const store = useEditorStore.getState();
    const currentPage = store.getCurrentPage();
    if (!currentPage) return;

    if (kind === "reorder-column") {
      const { columnId: activeColId, columnsBlockId, sectionId } = active.data.current;
      const overColId = over.data.current?.columnId;
      const overColumnsBlockId = over.data.current?.columnsBlockId;

      if (!overColId || overColId === activeColId) return;
      if (columnsBlockId !== overColumnsBlockId) return; // chỉ swap trong cùng columns block

      const section = currentPage.sections.find((s) => s.id === sectionId);
      const colsBlock = section?.blocks.find((b) => b.id === columnsBlockId) as ColumnsBlock | undefined;
      if (!colsBlock) return;

      const fromIndex = colsBlock.children.findIndex((c) => c.id === activeColId);
      const toIndex = colsBlock.children.findIndex((c) => c.id === overColId);
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

      store.reorderColumns(sectionId, columnsBlockId, fromIndex, toIndex);
      return;
    }

    const activeBlockId = active.data.current?.blockId;
    const overBlockId = over.data.current?.blockId;
    const overIsColumn = over.data.current?.isColumn === true;

    // if (!overBlockId || activeBlockId === overBlockId) return;

    if (kind === "reorder-block") {
      const sourceSectionId = active.data.current?.sectionId;
      const targetSectionId = over.data.current?.sectionId;
      if (!sourceSectionId || sourceSectionId !== targetSectionId) return;
      if (!overBlockId || activeBlockId === overBlockId) return;

      const section = currentPage.sections.find((s) => s.id === sourceSectionId);
      if (!section) return;

      const fromIndex = section.blocks.findIndex((b) => b.id === activeBlockId);
      const toIndex = section.blocks.findIndex((b) => b.id === overBlockId);
      if (fromIndex === -1 || toIndex === -1) return;

      store.reorderBlocks(sourceSectionId, fromIndex, toIndex);
      return;
    }

    if (kind === "reorder-column-block") {
      const sourceColumnId = active.data.current?.columnId;
      const targetColumnId = over.data.current?.columnId;
      const sourceSectionId = active.data.current?.sectionId;
      if (!sourceColumnId || !targetColumnId || !sourceSectionId) return;

      if (sourceColumnId === targetColumnId) {
        // Swap trong cùng column
        if (!overBlockId || activeBlockId === overBlockId) return;

        const section = currentPage.sections.find((s) => s.id === sourceSectionId);
        const colsBlock = section?.blocks.find(
          (b) => b.type === "columns" && (b as ColumnsBlock).children.some((c) => c.id === sourceColumnId),
        ) as ColumnsBlock | undefined;
        const col = colsBlock?.children.find((c) => c.id === sourceColumnId);
        if (!col) return;

        const fromIndex = col.blocks.findIndex((b) => b.id === activeBlockId);
        const toIndex = col.blocks.findIndex((b) => b.id === overBlockId);
        if (fromIndex === -1 || toIndex === -1) return;

        store.reorderBlockInColumn(sourceSectionId, sourceColumnId, fromIndex, toIndex);
      } else {
        // Move sang column khác — swap với block đang hover
        const toIndex = (() => {
          if (overIsColumn) {
            // Drop vào column rỗng → thêm vào cuối (index 0)
            return 0;
          }
          if (!overBlockId) return 0;

          const section = currentPage.sections.find((s) => s.id === sourceSectionId);
          const colsBlock = section?.blocks.find(
            (b) => b.type === "columns" && (b as ColumnsBlock).children.some((c) => c.id === targetColumnId),
          ) as ColumnsBlock | undefined;
          const targetCol = colsBlock?.children.find((c) => c.id === targetColumnId);
          const idx = targetCol?.blocks.findIndex((b) => b.id === overBlockId) ?? 0;
          return idx === -1 ? 0 : idx;
        })();
        store.moveBlockBetweenColumns(sourceSectionId, sourceColumnId, targetColumnId, activeBlockId, toIndex);
      }
    }
  }, []);

  return {
    sensors,
    collisionDetection: pointerWithin,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    overlayProps: { activeDragItem, activeDragKind, activeDragData, getBlockInfo, getBlockById },
  };
}
