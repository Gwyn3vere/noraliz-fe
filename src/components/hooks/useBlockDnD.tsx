import { useState, useCallback } from "react";
import { useSensor, useSensors, PointerSensor, pointerWithin, closestCenter } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent, DragOverEvent, CollisionDetection } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import { useEditorStore } from "@/stores/editorStore";
import type { PrimitiveBlock, Section, Block, ColumnBlock, ColumnsBlock, ContainerBlock } from "@/types";

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

function getBlockOrderInContainer(containerId: string, clientX: number, clientY: number): number {
  const blockElements = document.querySelectorAll(`[data-container-id="${containerId}"] [data-block-id]`);
  if (blockElements.length === 0) return 0;

  const blocksArray = Array.from(blockElements);
  const containerEl = document.querySelector(`[data-container-id="${containerId}"]`);
  const isHorizontal = ["row", "row-reverse"].includes(window.getComputedStyle(containerEl!).flexDirection);

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
  const isContainer = blockType === "container";
  const count = isColumns ? (defaultProps.count as number) || 2 : 0;

  const base = {
    id: uuidv4(),
    type: blockType,
    order,
    defaultClass: `block-${uuidv4()}`,
    classes: [] as string[],
    props: defaultProps,
  };

  if (isColumns) {
    const children: ColumnBlock[] = Array.from({ length: count }, (_, i) => ({
      id: uuidv4(),
      type: "column" as const,
      order: i,
      blocks: [],
      props: { styles: { flex: "1" } },
    }));
    return { ...base, children } as unknown as Block;
  }

  if (isContainer) {
    return { ...base, children: [] } as unknown as Block;
  }

  return base as unknown as Block;
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
    setActiveDragKind((event.active.data.current as any)?.kind ?? null);
    setActiveDragData(event.active.data.current ?? null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDragItem(null);
      setActiveDragKind(null);

      const { active, over } = event;
      if (!over) return;

      const activeData = (active.data.current as any) || {};
      const overData = (over.data.current as any) || {};
      const kind: string = activeData.kind;
      const { dropX, dropY } = getDropPoint(event);
      const store = useEditorStore.getState();

      // ── Reorder SECTION ──
      if (kind === "reorder-section") {
        const { sectionId } = activeData;
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
      if (
        kind === "reorder-block" ||
        kind === "reorder-column-block" ||
        kind === "reorder-container-block" ||
        kind === "reorder-column"
      )
        return;

      const blockType: string = activeData.blockType;
      const blockId: string = activeData.blockId;
      if (!blockType) return;

      // ── Drop SECTION ──────────────────────────────────────────────────────
      if (kind === "section") {
        const { currentPageId } = store;
        if (!currentPageId) return;

        const currentPage = store.getCurrentPage();
        const sections = currentPage?.sections || [];
        let order = sections.length; // mặc định cuối

        if (overData.order !== undefined) {
          order = overData.order;
        }

        const blockApi = blockId ? getBlockById(blockId) : null;
        const defaultProps = blockApi?.defaultProps
          ? typeof blockApi.defaultProps === "string"
            ? JSON.parse(blockApi.defaultProps)
            : blockApi.defaultProps
          : {};

        const newSection: Section = {
          id: uuidv4(),
          templateId: blockType,
          order,
          props: defaultProps,
          blocks: [],
        };
        store.addSection(newSection, order);
        return;
      }

      // ── Drop BLOCK ────────────────────────────────────────────────────────
      const targetSectionId = overData.sectionId;
      if (!targetSectionId) {
        if (overData.pageId) {
          console.warn("Cannot drop block outside a section");
        }
        return;
      }

      const blockApi = blockId ? getBlockById(blockId) : null;
      const variant = activeData.variant;

      const defaultProps = blockApi
        ? typeof blockApi.defaultProps === "string"
          ? JSON.parse(blockApi.defaultProps)
          : blockApi.defaultProps
        : getDefaultPropsForType(blockType, variant);

      // if (kind === "reorder-column-block") {
      //   const { blockId: reorderBlockId, sectionId: sourceSectionId, columnId: sourceColumnId } = activeData;
      //   const targetColumnId = overData.columnId;
      //   const targetSectionId = overData.sectionId;

      //   if (!targetColumnId || !targetSectionId) return;

      //   const currentPage = store.getCurrentPage();
      //   const section = currentPage?.sections.find((s) => s.id === sourceSectionId);
      //   const colsBlock = section?.blocks.find(
      //     (b) => b.type === "columns" && (b as ColumnsBlock).children.some((c) => c.id === sourceColumnId),
      //   ) as ColumnsBlock | undefined;

      //   if (!colsBlock) return;

      //   const sourceCol = colsBlock.children.find((c) => c.id === sourceColumnId);
      //   if (!sourceCol) return;

      //   const fromIndex = sourceCol.blocks.findIndex((b) => b.id === reorderBlockId);
      //   if (fromIndex === -1) return;

      //   if (sourceColumnId === targetColumnId) {
      //     // Reorder trong cùng column
      //     const toIndex = getBlockOrderInColumn(targetColumnId, dropX, dropY);
      //     if (fromIndex !== toIndex) {
      //       store.reorderBlockInColumn(sourceSectionId, sourceColumnId, fromIndex, toIndex);
      //     }
      //   } else {
      //     // Move sang column khác
      //     const toIndex = getBlockOrderInColumn(targetColumnId, dropX, dropY);
      //     store.moveBlockBetweenColumns(sourceSectionId, sourceColumnId, targetColumnId, reorderBlockId, toIndex);
      //   }
      //   return;
      // }

      const isContainer: boolean = overData.isContainer ?? false;
      const containerId: string | undefined = overData.containerId;

      if (isContainer && containerId) {
        if (blockType === "container" || blockType === "columns") {
          console.warn("Cannot nest containers or columns");
          return;
        }
        const order =
          overData.order !== undefined ? overData.order : getBlockOrderInContainer(containerId, dropX, dropY);
        const newBlock = buildBlock(blockType, order, defaultProps);
        store.addBlockToContainer(targetSectionId, containerId, newBlock, order);
        return;
      }

      const isColumn: boolean = overData.isColumn ?? false;
      const columnId: string | undefined = overData.columnId;

      if (isColumn && columnId) {
        if (blockType === "columns" || blockType === "container") {
          console.warn("Cannot nest containers or columns");
          return;
        }
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

    const activeData = (active.data.current as any) || {};
    const overData = (over.data.current as any) || {};

    const kind = activeData.kind;
    if (
      kind !== "reorder-block" &&
      kind !== "reorder-column-block" &&
      kind !== "reorder-column" &&
      kind !== "reorder-container-block"
    )
      return;

    const store = useEditorStore.getState();
    const currentPage = store.getCurrentPage();
    if (!currentPage) return;

    if (kind === "reorder-column") {
      const { columnId: activeColId, columnsBlockId, sectionId } = activeData;
      const overColId = overData.columnId;
      const overColumnsBlockId = overData.columnsBlockId;

      if (!overColId || overColId === activeColId) return;
      if (columnsBlockId !== overColumnsBlockId) return;

      const section = currentPage.sections.find((s) => s.id === sectionId);
      const colsBlock = section?.blocks.find((b) => b.id === columnsBlockId) as ColumnsBlock | undefined;
      if (!colsBlock) return;

      const fromIndex = colsBlock.children.findIndex((c) => c.id === activeColId);
      const toIndex = colsBlock.children.findIndex((c) => c.id === overColId);
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

      store.reorderColumns(sectionId, columnsBlockId, fromIndex, toIndex);
      return;
    }

    const activeBlockId = activeData.blockId;
    const overBlockId = overData.blockId;
    const overIsColumn = overData.isColumn === true;

    if (kind === "reorder-block") {
      const sourceSectionId = activeData.sectionId;
      const targetSectionId = overData.sectionId;
      if (!sourceSectionId || sourceSectionId !== targetSectionId) return;

      const overBlockId = overData.blockId || (overData.isContainer ? overData.containerId : null);
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
      const sourceColumnId = activeData.columnId;
      const targetColumnId = overData.columnId;
      const sourceSectionId = activeData.sectionId;
      if (!sourceColumnId || !targetColumnId || !sourceSectionId) return;

      if (sourceColumnId === targetColumnId) {
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
        const toIndex = (() => {
          if (overIsColumn) return 0;
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

    if (kind === "reorder-container-block") {
      const sourceContainerId = activeData.containerId;
      const targetContainerId = overData.containerId;
      const sourceSectionId = activeData.sectionId;

      if (!sourceContainerId || !targetContainerId || !sourceSectionId) return;

      if (sourceContainerId === targetContainerId) {
        // Swap trong cùng container
        if (!overBlockId || activeBlockId === overBlockId) return;

        const section = currentPage.sections.find((s) => s.id === sourceSectionId);
        const containerBlock = section?.blocks.find((b) => b.id === sourceContainerId && b.type === "container") as
          | ContainerBlock
          | undefined;
        if (!containerBlock) return;

        const fromIndex = containerBlock.children.findIndex((b) => b.id === activeBlockId);
        const toIndex = containerBlock.children.findIndex((b) => b.id === overBlockId);
        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

        store.reorderBlockInContainer(sourceSectionId, sourceContainerId, fromIndex, toIndex);
      } else {
        // Move sang container khác (có thể thêm sau)
      }
    }
  }, []);

  return {
    sensors,
    collisionDetection: useCallback(
      (args: Parameters<CollisionDetection>[0]) => {
        if (activeDragKind === "section") {
          return closestCenter(args);
        }
        return pointerWithin(args);
      },
      [activeDragKind],
    ),
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    overlayProps: { activeDragItem, activeDragKind, activeDragData, getBlockInfo, getBlockById },
  };
}
