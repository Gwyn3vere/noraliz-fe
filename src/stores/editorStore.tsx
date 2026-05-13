import { create } from "zustand";
import type { Project, Page, Section, Block } from "@/types";

interface EditorState {
  // ─── Core Data ───
  currentProject: Project | null;
  currentPageId: string | null;

  // ─── Selection ───
  selectedSectionId: string | null;
  selectedBlockId: string | null;

  // ─── History (Undo/Redo) ───
  past: Project[];
  future: Project[];

  // ─── UI State ───
  isDirty: boolean;
  lastSavedAt: string | null;

  // ─── Actions: Project ───
  setCurrentProject: (project: Project) => void;

  // ─── Actions: Page ───
  setCurrentPage: (pageId: string) => void;

  // ─── Actions: Section ───
  addSection: (section: Section) => void;
  removeSection: (sectionId: string) => void;
  updateSection: (sectionId: string, updater: (section: Section) => Section) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;

  // ─── Actions: Block ───
  addBlock: (sectionId: string, block: Block) => void;
  removeBlock: (sectionId: string, blockId: string) => void;
  updateBlock: (blockId: string, updater: (block: Block) => Block) => void;
  reorderBlocks: (sectionId: string, fromIndex: number, toIndex: number) => void;

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
  addSection: (section) => {
    const { currentProject, currentPageId, pushToHistory } = get();
    if (!currentProject || !currentPageId) return;

    pushToHistory();

    set((state) => {
      const updatedPages = state.currentProject!.pages.map((page) => {
        if (page.id !== currentPageId) return page;
        return {
          ...page,
          sections: [...page.sections, section],
        };
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

  clearSelection: () => set({ selectedSectionId: null, selectedBlockId: null }),

  // ─── Block ───
  addBlock: (sectionId, block) => {
    const { pushToHistory } = get();
    pushToHistory();

    set((state) => {
      const updatedPages = state.currentProject!.pages.map((page) => ({
        ...page,
        sections: page.sections.map((s) => {
          if (s.id !== sectionId) return s;
          return { ...s, blocks: [...s.blocks, block] };
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
          return { ...s, blocks: s.blocks.filter((b) => b.id !== blockId) };
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
        sections: page.sections.map((s) => ({
          ...s,
          blocks: s.blocks.map((b) => {
            if (b.id !== blockId) return b;
            return updater(b);
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

  // ─── Selection ───
  selectSection: (sectionId) => {
    set({ selectedSectionId: sectionId, selectedBlockId: null });
  },

  selectBlock: (blockId) => {
    set({ selectedBlockId: blockId, selectedSectionId: null });
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
