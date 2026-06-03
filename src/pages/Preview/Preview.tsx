import { useState, useEffect } from "react";
import { BlockPreview } from "./BlockPreview";
import { getResponsiveStyle } from "@/helper/responsive";
import type { Project, Section } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  DesktopIcon,
  DeviceTabletSpeakerIcon,
  DeviceMobileSpeakerIcon,
  SlidersHorizontalIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function SectionPreview({ section, forceBreakpoint }: { section: Section; forceBreakpoint?: string }) {
  const rawStyles = (section.props as any)?.styles ?? {};
  if (forceBreakpoint) {
    const style = getResponsiveStyle(rawStyles, forceBreakpoint);
    return (
      <section style={style}>
        {section.blocks.map((block) => (
          <BlockPreview key={block.id} block={block} forceBreakpoint={forceBreakpoint} />
        ))}
      </section>
    );
  }

  const normalized = rawStyles.base ? rawStyles : { base: rawStyles };
  const base = normalized.base ? { ...normalized.base } : {};
  const tablet = normalized.tablet ? { ...normalized.base, ...normalized.tablet } : undefined;
  const mobile = normalized.mobile
    ? { ...normalized.base, ...(normalized.tablet ?? {}), ...normalized.mobile }
    : undefined;

  const sectionId = section.id;
  const className = `section-${sectionId}`;

  let css = `.${className} { ${Object.entries(base)
    .map(([key, value]) => `${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${String(value)}`)
    .join("; ")} }`;

  if (tablet) {
    css += ` @media (max-width: 768px) { .${className} { ${Object.entries(tablet)
      .map(([key, value]) => `${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${String(value)}`)
      .join("; ")} } }`;
  }
  if (mobile) {
    css += ` @media (max-width: 375px) { .${className} { ${Object.entries(mobile)
      .map(([key, value]) => `${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${String(value)}`)
      .join("; ")} } }`;
  }

  return (
    <>
      <style>{css}</style>
      <section className={className}>
        {section.blocks.map((block) => (
          <BlockPreview key={block.id} block={block} />
        ))}
      </section>
    </>
  );
}

export default function Preview() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewBreakpoint, setViewBreakpoint] = useState<string>("base");
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("previewProject");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProject(parsed);
        if (parsed.pages?.length) {
          setCurrentPageId(parsed.pages[0].id);
        }
      } catch {}
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading preview...</div>;
  if (!project) return <p>No project data received.</p>;

  const currentPage = project.pages.find((p) => p.id === currentPageId) || project.pages[0];
  if (!currentPage) return <p>No page found.</p>;

  const containerWidth = viewBreakpoint === "tablet" ? 768 : viewBreakpoint === "mobile" ? 375 : "100%";

  return (
    <div className="flow-root">
      <div className="grid grid-cols-3 items-center bg-[var(--color-light)] sticky top-0 z-1000 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[var(--color-primary)] rounded-[10px]" />
          <span className="font-display text-[24px] uppercase font-bold">Noraliz</span>
        </div>

        <div
          className={cn(
            "flex items-center px-2",
            "w-full h-[40px] border-5 border-[var(--color-light)] bg-[var(--color-dark)]/5 rounded-[10px]",
          )}
        >
          <SlidersHorizontalIcon size={16} weight="bold" />
          <Select value={currentPage.id} onValueChange={setCurrentPageId}>
            <SelectTrigger className="flex-1 text-[13px] font-medium px-2 bg-transparent border-0 shadow-none focus:ring-0">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent className="bg-white z-1000">
              {project.pages.map((page) => (
                <SelectItem key={page.id} value={page.id}>
                  {page.name} ({page.slug})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 p-3 ml-auto">
          <Button
            onClick={() => setViewBreakpoint("base")}
            className={`px-3 py-1 rounded ${viewBreakpoint === "base" ? "bg-[var(--color-primary)] text-white" : "bg-white"}`}
          >
            <DesktopIcon />
          </Button>
          <Button
            onClick={() => setViewBreakpoint("tablet")}
            className={`px-3 py-1 rounded ${viewBreakpoint === "tablet" ? "bg-[var(--color-primary)] text-white" : "bg-white"}`}
          >
            <DeviceTabletSpeakerIcon />
          </Button>
          <Button
            onClick={() => setViewBreakpoint("mobile")}
            className={`px-3 py-1 rounded ${viewBreakpoint === "mobile" ? "bg-[var(--color-primary)] text-white" : "bg-white"}`}
          >
            <DeviceMobileSpeakerIcon />
          </Button>
        </div>
      </div>
      <div style={{ maxWidth: containerWidth, margin: "0 auto", overflow: "hidden" }}>
        {currentPage.sections.map((section) => (
          <SectionPreview key={section.id} section={section} forceBreakpoint={viewBreakpoint} />
        ))}
      </div>
    </div>
  );
}
