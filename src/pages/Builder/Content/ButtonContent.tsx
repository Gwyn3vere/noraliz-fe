import React, { useState, useCallback } from "react";
import type { Block, ButtonBlock } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { contentStyles as styles } from "./Content.styles";
import ContentWrapper from "./ContentWrapper";
import FieldRow from "./FieldRow";
import useBlockUpdater from "@/helper/useBlockUpdater";
import { useEditorStore } from "@/stores/editorStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type LinkType = "url" | "page" | "anchor";

function ButtonContent({ block }: { block: Block }) {
  const b = block as ButtonBlock;
  const update = useBlockUpdater(b.id);

  // Detect link type hiện tại từ href
  const detectLinkType = useCallback((href: string): LinkType => {
    if (!href) return "url";
    if (href.startsWith("#")) return "anchor";
    if (href.endsWith(".html") || href.startsWith("/")) return "page";
    return "url";
  }, []);

  const [linkType, setLinkType] = useState<LinkType>(() => detectLinkType(b.props?.href ?? ""));

  const currentProject = useEditorStore((s) => s.currentProject);
  const currentPageId = useEditorStore((s) => s.currentPageId);
  const pages = currentProject?.pages ?? [];

  const currentPage = pages.find((p) => p.id === currentPageId);
  const sections = currentPage?.sections ?? [];

  const handleLinkTypeChange = useCallback(
    (type: LinkType) => {
      setLinkType(type);
      update({ href: "" });
    },
    [update],
  );

  return (
    <ContentWrapper>
      <FieldRow label="Label">
        <Input
          value={b.props?.label ?? ""}
          onChange={(e) => update({ label: e.target.value })}
          placeholder="Button text..."
          className={styles.contentInput}
        />
      </FieldRow>

      <FieldRow label="Link">
        {/* Tab chọn loại link */}
        <div className="flex gap-[4px] mb-[8px]">
          {(["url", "page", "anchor"] as LinkType[]).map((type) => (
            <Button
              key={type}
              onClick={() => handleLinkTypeChange(type)}
              className={cn(
                "flex-1 h-[28px] rounded-md text-[11px] font-medium border transition-colors capitalize",
                linkType === type
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                  : "bg-[var(--color-dark)] text-[var(--color-light)] hover:bg-[var(--color-primary)]",
              )}
            >
              {type === "url" ? "URL" : type === "page" ? "Page" : "Anchor"}
            </Button>
          ))}
        </div>

        {/* URL input */}
        {linkType === "url" && (
          <Input
            value={b.props?.href ?? ""}
            onChange={(e) => update({ href: e.target.value })}
            placeholder="https://example.com"
            className={styles.contentInput}
          />
        )}

        {/* Page select */}
        {linkType === "page" && (
          <Select key={`page-${b.id}`} value={b.props?.href ?? ""} onValueChange={(value) => update({ href: value })}>
            <SelectTrigger className={styles.contentInput}>
              <SelectValue placeholder="Select a page..." />
            </SelectTrigger>
            <SelectContent className="bg-white border-none">
              {pages.map((page) => (
                <SelectItem key={page.id} value={`/${page.slug}`} className={styles.contentSelect}>
                  {page.name} ({page.slug})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Anchor select */}
        {linkType === "anchor" && (
          <Select key={`anchor-${b.id}`} value={b.props?.href ?? ""} onValueChange={(value) => update({ href: value })}>
            <SelectTrigger className={styles.contentInput}>
              <SelectValue placeholder="Select a section..." />
            </SelectTrigger>
            <SelectContent className="bg-white border-none">
              {sections.map((section, index) => (
                <SelectItem key={section.id} value={`#${section.id}`} className={styles.contentSelect}>
                  Section {index + 1}
                  {section.templateId ? ` — ${section.templateId}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </FieldRow>
    </ContentWrapper>
  );
}

export default React.memo(ButtonContent);
