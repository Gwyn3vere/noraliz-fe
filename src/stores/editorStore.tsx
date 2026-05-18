import { create } from "zustand";
import type { Project, Page, Section, Block, ColumnsBlock } from "@/types";

interface EditorState {
  // ─── Core Data ───
  currentProject: Project | null;
  currentPageId: string | null;

  // ─── Selection ───
  selectedSectionId: string | null;
  selectedBlockId: string | null;
  selectedColumnId: string | null;
  selectedColumnSectionId: string | null;

  // ─── History (Undo/Redo) ───
  past: Project[];
  future: Project[];

  // ─── UI State ───
  isDirty: boolean;
  lastSavedAt: string | null;
  // ─── Inline Editing ───
  isInlineEditing: boolean;

  // ─── Reorder ───
  reorderingSectionId: string | null;

  // ─── Actions: Project ───
  setCurrentProject: (project: Project) => void;

  // ─── Actions: Page ───
  setCurrentPage: (pageId: string) => void;

  // ─── Actions: Section ───
  addSection: (section: Section, order?: number) => void;
  removeSection: (sectionId: string) => void;
  updateSection: (sectionId: string, updater: (section: Section) => Section) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;

  // ─── Actions: Block ───
  addBlock: (sectionId: string, block: Block, order?: number) => void;
  removeBlock: (sectionId: string, blockId: string) => void;
  updateBlock: (blockId: string, updater: (block: Block) => Block) => void;

  addBlockToColumn: (sectionId: string, columnId: string, block: Block, order: number) => void;
  selectColumn: (columnId: string | null, sectionId?: string) => void;
  removeColumn: (sectionId: string, columnId: string) => void;

  // ─── Actions: Inline Editing ───
  setInlineEditing: (editing: boolean) => void;

  // ─── Actions: Reorder ───
  reorderBlocks: (sectionId: string, fromIndex: number, toIndex: number) => void;
  reorderColumns: (sectionId: string, columnsBlockId: string, fromIndex: number, toIndex: number) => void;
  reorderBlockInColumn: (sectionId: string, columnId: string, fromIndex: number, toIndex: number) => void;
  moveBlockBetweenColumns: (
    sectionId: string,
    fromColumnId: string,
    toColumnId: string,
    blockId: string,
    toIndex: number,
  ) => void;

  setReorderingSection: (sectionId: string | null) => void;

  // ─── Actions: Selection ───
  selectSection: (sectionId: string | null) => void;
  selectBlock: (blockId: string | null) => void;
  clearSelection: () => void;

  // ─── Actions: History ───
  undo: () => void;
  redo: () => void;
  pushToHistory: () => void;

  // ─── Actions: Save ───
  markDirty: () => void;
  markSaved: () => void;

  // ─── Helpers ───
  getCurrentPage: () => Page | undefined;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // ─── Initial State ───
  currentProject: null,
  currentPageId: null,
  selectedSectionId: null,
  selectedBlockId: null,
  selectedColumnId: null,
  selectedColumnSectionId: null,
  reorderingSectionId: null,
  isInlineEditing: false,
  past: [],
  future: [],
  isDirty: false,
  lastSavedAt: null,

  // ─── Project ───
  setCurrentProject: (project) => {
    set({
      currentProject: project,
      currentPageId: project.pages[0]?.id || null,
      past: [],
      future: [],
      isDirty: false,
    });
  },

  // ─── Page ───
  setCurrentPage: (pageId) => {
    set({ currentPageId: pageId });
  },

  // ─── Editing ───
  setInlineEditing: (editing) => set({ isInlineEditing: editing }),

  // ─── Reorder ───
  setReorderingSection: (sectionId) => set({ reorderingSectionId: sectionId }),

  // ─── History Helpers ───
  pushToHistory: () => {
    const { currentProject } = get();
    if (!currentProject) return;

    set((state) => ({
      past: [...state.past.slice(-49), currentProject], // Giới hạn 50 bước
      future: [],
    }));
  },

  // ─── Section ───
  addSection: (section, order) => {
    const { pushToHistory, currentProject, currentPageId } = get();
    if (!currentProject || !currentPageId) return;
    pushToHistory();

    set((state) => {
      const updatedPages = state.currentProject!.pages.map((page) => {
        if (page.id !== currentPageId) return page;
        const sections = [...page.sections];
        const insertIndex = order !== undefined && order >= 0 ? order : sections.length;
        sections.splice(insertIndex, 0, section);
        return { ...page, sections };
      });
      return {
        currentProject: { ...state.currentProject!, pages: updatedPages },
        isDirty: true,
      };
    });
  },

  removeSection: (sectionId) => {
    const { pushToHistory } = get();
    pushToHistory();

    set((state) => {
      const updatedPages = state.currentProject!.pages.map((page) => ({
        ...page,
        sections: page.sections.filter((s) => s.id !== sectionId),
      }));
      return {
        currentProject: { ...state.currentProject!, pages: updatedPages },
        isDirty: true,
      };
    });
  },

  updateSection: (sectionId, updater) => {
    const { pushToHistory } = get();
    pushToHistory();

    set((state) => {
      const updatedPages = state.currentProject!.pages.map((page) => ({
        ...page,
        sections: page.sections.map((s) => {
          if (s.id !== sectionId) return s;
          return updater(s);
        }),
      }));
      return {
        currentProject: { ...state.currentProject!, pages: updatedPages },
        isDirty: true,
      };
    });
  },

  reorderSections: (fromIndex, toIndex) => {
    const { pushToHistory } = get();
    pushToHistory();

    set((state) => {
      const currentPage = state.currentProject?.pages.find((p) => p.id === state.currentPageId);
      if (!currentPage || !state.currentProject) return {};

      const updatedSections = [...currentPage.sections];
      const [moved] = updatedSections.splice(fromIndex, 1);
      updatedSections.splice(toIndex, 0, moved);

      const updatedPages = state.currentProject.pages.map((page) => {
        if (page.id !== state.currentPageId) return page;
        return { ...page, sections: updatedSections };
      });

      return {
        currentProject: { ...state.currentProject, pages: updatedPages },
        isDirty: true,
      };
    });
  },

  clearSelection: () =>
    set({
      selectedSectionId: null,
      selectedBlockId: null,
      selectedColumnId: null,
      selectedColumnSectionId: null,
    }),

  // ─── Block ───
  addBlock: (sectionId, block, order?: number) => {
    const { pushToHistory } = get();
    pushToHistory();

    set((state) => {
      const updatedPages = state.currentProject!.pages.map((page) => ({
        ...page,
        sections: page.sections.map((s) => {
          if (s.id !== sectionId) return s;
          const blocks = [...s.blocks];
          const insertIndex = order !== undefined && order >= 0 ? order : blocks.length;
          blocks.splice(insertIndex, 0, block);
          return { ...s, blocks };
        }),
      }));
      return {
        currentProject: { ...state.currentProject!, pages: updatedPages },
        isDirty: true,
      };
    });
  },

  addBlockToColumn: (sectionId, columnId, block, order) => {
    const { pushToHistory } = get();
    pushToHistory();
    set((state) => {
      const updatedPages = state.currentProject!.pages.map((page) => ({
        ...page,
        sections: page.sections.map((section) => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            blocks: section.blocks.map((b) => {
              if (b.type !== "columns" || !("children" in b)) return b;
              const colsBlock = b as ColumnsBlock;
              return {
                ...colsBlock,
                children: colsBlock.children.map((col) => {
                  if (col.id !== columnId) return col;
                  const blocks = [...col.blocks];
                  const insertIndex = order >= 0 ? order : blocks.length;
                  blocks.splice(insertIndex, 0, block);
                  return { ...col, blocks };
                }),
              };
            }),
          };
        }),
      }));
      return {
        currentProject: { ...state.currentProject!, pages: updatedPages },
        isDirty: true,
      };
    });
  },

  removeBlock: (sectionId, blockId) => {
    const { pushToHistory } = get();
    pushToHistory();

    set((state) => {
      const updatedPages = state.currentProject!.pages.map((page) => ({
        ...page,
        sections: page.sections.map((s) => {
          if (s.id !== sectionId) return s;

          // Lọc block trực tiếp trong section
          const updatedBlocks = s.blocks
            .filter((b) => {
              if (b.id === blockId) return false;
              return true;
            })
            .map((b) => {
              // Nếu là columns, lọc trong children
              if (b.type === "columns" && "children" in b) {
                const colsBlock = b as ColumnsBlock;
                return {
                  ...colsBlock,
                  children: colsBlock.children.map((col) => ({
                    ...col,
                    blocks: col.blocks.filter((childBlock) => childBlock.id !== blockId),
                  })),
                };
              }
              return b;
            });

          return { ...s, blocks: updatedBlocks };
        }),
      }));
      return {
        currentProject: { ...state.currentProject!, pages: updatedPages },
        isDirty: true,
      };
    });
  },

  updateBlock: (blockId, updater) => {
    const { pushToHistory } = get();
    pushToHistory();

    set((state) => {
      const updatedPages = state.currentProject!.pages.map((page) => ({
        ...page,
        sections: page.sections.map((section) => ({
          ...section,
          blocks: section.blocks.map((b) => {
            // Nếu chính block này được chọn
            if (b.id === blockId) return updater(b);

            // Nếu là columns, tìm trong children
            if (b.type === "columns" && "children" in b) {
              const colsBlock = b as ColumnsBlock;
              return {
                ...colsBlock,
                children: colsBlock.children.map((col) => ({
                  ...col,
                  blocks: col.blocks.map((childBlock) => {
                    if (childBlock.id === blockId) return updater(childBlock);
                    return childBlock;
                  }),
                })),
              };
            }

            return b;
          }),
        })),
      }));
      return {
        currentProject: { ...state.currentProject!, pages: updatedPages },
        isDirty: true,
      };
    });
  },

  reorderBlocks: (sectionId, fromIndex, toIndex) => {
    const { pushToHistory } = get();
    pushToHistory();

    set((state) => {
      const updatedPages = state.currentProject!.pages.map((page) => {
        if (page.id !== state.currentPageId) return page;
        return {
          ...page,
          sections: page.sections.map((s) => {
            if (s.id !== sectionId) return s;
            const updatedBlocks = [...s.blocks];
            const [moved] = updatedBlocks.splice(fromIndex, 1);
            updatedBlocks.splice(toIndex, 0, moved);
            return { ...s, blocks: updatedBlocks };
          }),
        };
      });
      return {
        currentProject: { ...state.currentProject!, pages: updatedPages },
        isDirty: true,
      };
    });
  },

  // ─── Column ───
  reorderBlockInColumn: (sectionId, columnId, fromIndex, toIndex) => {
    const { pushToHistory } = get();
    pushToHistory();
    set((state) => ({
      currentProject: {
        ...state.currentProject!,
        pages: state.currentProject!.pages.map((page) => ({
          ...page,
          sections: page.sections.map((section) => {
            if (section.id !== sectionId) return section;
            return {
              ...section,
              blocks: section.blocks.map((b) => {
                if (b.type !== "columns" || !("children" in b)) return b;
                const cols = b as ColumnsBlock;
                return {
                  ...cols,
                  children: cols.children.map((col) => {
                    if (col.id !== columnId) return col;
                    const blocks = [...col.blocks];
                    const [moved] = blocks.splice(fromIndex, 1);
                    blocks.splice(toIndex, 0, moved);
                    return { ...col, blocks };
                  }),
                };
              }),
            };
          }),
        })),
      },
      isDirty: true,
    }));
  },

  moveBlockBetweenColumns: (sectionId, fromColumnId, toColumnId, blockId, toIndex) => {
    const { pushToHistory } = get();
    pushToHistory();
    set((state) => {
      let blockToMove: Block | null = null;
      const pages = state.currentProject!.pages.map((page) => ({
        ...page,
        sections: page.sections.map((section) => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            blocks: section.blocks.map((b) => {
              if (b.type !== "columns" || !("children" in b)) return b;
              const cols = b as ColumnsBlock;
              return {
                ...cols,
                children: cols.children.map((col) => {
                  if (col.id === fromColumnId) {
                    // Lấy block ra khỏi source column
                    const idx = col.blocks.findIndex((bl) => bl.id === blockId);
                    if (idx !== -1) {
                      blockToMove = col.blocks[idx];
                      return { ...col, blocks: col.blocks.filter((bl) => bl.id !== blockId) };
                    }
                  }
                  return col;
                }),
              };
            }),
          };
        }),
      }));

      if (!blockToMove) return {};

      // Insert vào target column
      const finalPages = pages.map((page) => ({
        ...page,
        sections: page.sections.map((section) => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            blocks: section.blocks.map((b) => {
              if (b.type !== "columns" || !("children" in b)) return b;
              const cols = b as ColumnsBlock;
              return {
                ...cols,
                children: cols.children.map((col) => {
                  if (col.id !== toColumnId) return col;
                  const blocks = [...col.blocks];
                  blocks.splice(toIndex, 0, blockToMove!);
                  return { ...col, blocks };
                }),
              };
            }),
          };
        }),
      }));

      return {
        currentProject: { ...state.currentProject!, pages: finalPages },
        isDirty: true,
      };
    });
  },

  reorderColumns: (sectionId, columnsBlockId, fromIndex, toIndex) => {
    const { pushToHistory } = get();
    pushToHistory();
    set((state) => ({
      currentProject: {
        ...state.currentProject!,
        pages: state.currentProject!.pages.map((page) => ({
          ...page,
          sections: page.sections.map((section) => {
            if (section.id !== sectionId) return section;
            return {
              ...section,
              blocks: section.blocks.map((b) => {
                if (b.id !== columnsBlockId || b.type !== "columns") return b;
                const cols = b as ColumnsBlock;
                const children = [...cols.children];
                const [moved] = children.splice(fromIndex, 1);
                children.splice(toIndex, 0, moved);
                return { ...cols, children };
              }),
            };
          }),
        })),
      },
      isDirty: true,
    }));
  },

  removeColumn: (sectionId, columnId) => {
    const { pushToHistory } = get();
    pushToHistory();
    set((state) => {
      const updatedPages = state.currentProject!.pages.map((page) => ({
        ...page,
        sections: page.sections.map((section) => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            blocks: section.blocks.map((b) => {
              if (b.type !== "columns" || !("children" in b)) return b;
              const colsBlock = b as ColumnsBlock;
              return {
                ...colsBlock,
                children: colsBlock.children.filter((col) => col.id !== columnId),
              };
            }),
          };
        }),
      }));
      return { currentProject: { ...state.currentProject!, pages: updatedPages }, isDirty: true };
    });
  },

  // ─── Selection ───
  selectSection: (sectionId) => {
    set({
      selectedSectionId: sectionId,
      selectedBlockId: null,
      selectedColumnId: null,
      selectedColumnSectionId: null,
      reorderingSectionId: null,
    });
  },

  selectBlock: (blockId) => {
    set({
      selectedBlockId: blockId,
      selectedSectionId: null,
      selectedColumnId: null,
      selectedColumnSectionId: null,
    });
  },

  selectColumn: (columnId, sectionId) => {
    set({
      selectedColumnId: columnId,
      selectedColumnSectionId: sectionId ?? null,
      selectedBlockId: null,
      selectedSectionId: null,
    });
  },

  // ─── Undo / Redo ───
  undo: () => {
    const { past, currentProject } = get();
    if (past.length === 0 || !currentProject) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);

    set({
      currentProject: previous,
      past: newPast,
      future: [currentProject, ...get().future],
    });
  },

  redo: () => {
    const { future, currentProject } = get();
    if (future.length === 0 || !currentProject) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      currentProject: next,
      past: [...get().past, currentProject],
      future: newFuture,
    });
  },

  // ─── Save ───
  markDirty: () => set({ isDirty: true }),
  markSaved: () => set({ isDirty: false, lastSavedAt: new Date().toISOString() }),

  // ─── Helpers ───
  getCurrentPage: () => {
    const { currentProject, currentPageId } = get();
    return currentProject?.pages.find((p) => p.id === currentPageId);
  },
}));
