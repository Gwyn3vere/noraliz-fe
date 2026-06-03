import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editorStore";
import type { Section } from "@/types";
import { FloatingSectionToolbar } from "../FloatingSectionToolbar";
import { useSectionDrop } from "@/components/hooks/useSectionDrop";
import { BlockRenderer } from "./BlockRenderer";
import { normalizeStyles } from "@/helper/normalizeStyles";

export function SectionRenderer({ section }: { section: Section }) {
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  const selectSection = useEditorStore((state) => state.selectSection);
  const isSelected = selectedSectionId === section.id;
  const [isHovered, setIsHovered] = useState(false);

  const activeBreakpoint = useEditorStore((s) => s.activeBreakpoint);
  const rawStyles = (section.props as any)?.styles ?? {};
  const normalizedStyles = normalizeStyles(rawStyles);

  const currentStyles = useMemo(() => {
    const base = normalizedStyles.base || {};
    if (activeBreakpoint === "base") return base;
    if (activeBreakpoint === "tablet") return { ...base, ...(normalizedStyles.tablet ?? {}) };
    if (activeBreakpoint === "mobile")
      return { ...base, ...(normalizedStyles.tablet ?? {}), ...(normalizedStyles.mobile ?? {}) };
    return base;
  }, [normalizedStyles, activeBreakpoint]);

  const { setNodeRef, isOver } = useSectionDrop(section.id);

  const sectionStyles: React.CSSProperties = {
    ...currentStyles,
  };

  const showOutline = isHovered || isSelected;
  const editorClasses = cn(
    "relative p-4 transition-all outline outline-2 outline-dashed outline-offset-[-2px]",
    showOutline ? "outline-[var(--color-primary)]" : "outline-transparent",
    isSelected ? "before:absolute before:inset-0 before:bg-[var(--color-primary)]/5 before:pointer-events-none" : "",
    isOver ? "bg-[var(--color-primary)]/10" : "",
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectSection(section.id);
  };

  return (
    <section
      ref={setNodeRef}
      id={section.id}
      data-section-id={section.id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={editorClasses}
      style={{ ...sectionStyles, border: section.blocks.length === 0 ? "1px dashed #0000003a" : "" }}
      onClick={handleClick}
    >
      {isSelected && (
        <FloatingSectionToolbar sectionId={section.id} order={section.order} onClose={() => selectSection(null)} />
      )}
      {section.blocks.length === 0 && (
        <div
          className={cn(
            "flex flex-col items-center justify-center h-full w-full gap-2",
            "pointer-events-none select-none text-[var(--color-dark)]/20",
          )}
        >
          <span className="text-[14px] font-medium uppercase tracking-wide">Blank Section</span>
          <span className="text-[11px]">Drop blocks here</span>
        </div>
      )}
      {section.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} sectionId={section.id} />
      ))}
    </section>
  );
}
