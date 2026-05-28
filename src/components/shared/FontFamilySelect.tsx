import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import type { RefObject } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { contentStyles as styles } from "../../pages/Builder/Content/Content.styles";

interface Props {
  value: string;
  onChange: (font: string) => void;
  fonts: { family: string }[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
  onPreview: (family: string) => void;
  loadedSetRef: RefObject<Set<string>>;
}

const FontPreviewItem = React.memo(({ family }: { family: string }) => (
  <span className="w-full truncate block" style={{ fontFamily: family }}>
    {family}
  </span>
));
FontPreviewItem.displayName = "FontPreviewItem";

const FontSkeletonItem = React.memo(() => <div className="h-5 w-full animate-pulse rounded bg-neutral-200" />);
FontSkeletonItem.displayName = "FontSkeletonItem";

export default function FontFamilySelect({
  value,
  onChange,
  fonts,
  loading,
  error,
  hasMore,
  onLoadMore,
  onPreview,
  loadedSetRef,
}: Props) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewedFontsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 150);
  }, []);

  const filteredFonts = useMemo(() => {
    if (!debouncedSearch.trim()) return fonts;
    const q = debouncedSearch.toLowerCase();
    return fonts.filter((f) => f.family.toLowerCase().includes(q));
  }, [fonts, debouncedSearch]);

  useEffect(() => {
    filteredFonts.forEach((font) => {
      if (!previewedFontsRef.current.has(font.family)) {
        previewedFontsRef.current.add(font.family);
        onPreview(font.family);
      }
    });
  }, [filteredFonts, onPreview]);

  useEffect(() => {
    filteredFonts.forEach((font) => onPreview(font.family));
  }, [filteredFonts, onPreview]);

  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else {
      setSearch("");
      setDebouncedSearch("");
    }
  }, []);

  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el || !hasMore || loading) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
      onLoadMore();
    }
  }, [hasMore, loading, onLoadMore]);

  return (
    <Select value={value} onValueChange={onChange} onOpenChange={handleOpenChange}>
      <SelectTrigger className={styles.contentInput}>
        <SelectValue placeholder="Select font...">
          {value ? <span style={{ fontFamily: value }}>{value}</span> : "Select font..."}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className="max-h-[360px] max-w-[220px] border-none bg-white p-0">
        <div className="sticky top-0 z-10 bg-white p-2 border-b border-neutral-100">
          <Input
            ref={inputRef}
            value={search}
            onChange={handleSearchChange}
            placeholder="Search fonts..."
            className={styles.contentInput}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>

        <div ref={listRef} onScroll={handleScroll} className="max-h-[280px] overflow-auto px-1 py-1">
          {error && <div className="px-2 py-2 text-sm text-red-500">{error}</div>}

          {filteredFonts.map((font) => {
            const isLoaded = loadedSetRef.current?.has(font.family) ?? false;
            return (
              <SelectItem
                key={font.family}
                value={font.family}
                className={cn(styles.contentSelect, "my-0.5 h-7 overflow-hidden rounded-sm")}
              >
                {isLoaded ? <FontPreviewItem family={font.family} /> : <FontSkeletonItem />}
              </SelectItem>
            );
          })}

          {loading && (
            <div className="space-y-1.5 p-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <FontSkeletonItem key={i} />
              ))}
            </div>
          )}

          {hasMore && !loading && (
            <button
              type="button"
              className="w-full py-2 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
              onClick={onLoadMore}
            >
              Load more fonts
            </button>
          )}
        </div>
      </SelectContent>
    </Select>
  );
}
