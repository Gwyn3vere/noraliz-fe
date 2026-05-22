import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fontRegistry } from "@/lib/FontRegistry";

interface GoogleFont {
  family: string;
  variants: string[];
  category: string;
}

const API_KEY = import.meta.env.VITE_REACT_APP_API_GOOGLE_FONT_KEY;
const BASE_URL = "https://www.googleapis.com/webfonts/v1/webfonts";
const PAGE_SIZE = 30;

// Module-level cache — tồn tại suốt session, không bị reset khi component unmount
let cachedFonts: GoogleFont[] | null = null;
let fetchPromise: Promise<GoogleFont[]> | null = null;

async function fetchGoogleFonts(): Promise<GoogleFont[]> {
  if (cachedFonts) return cachedFonts;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch(`${BASE_URL}?key=${API_KEY}&sort=popularity`)
    .then((r) => r.json())
    .then((data) => {
      cachedFonts = data.items || [];
      fetchPromise = null;
      return cachedFonts!;
    });

  return fetchPromise;
}

export function useFontManager() {
  const [fonts, setFonts] = useState<GoogleFont[]>(cachedFonts || []);
  const [loading, setLoading] = useState(!cachedFonts);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const loadedSetRef = useRef<Set<string>>(new Set(fontRegistry.getLoadedFamilies()));
  const [, forceUpdateFontList] = useState(0);

  useEffect(() => {
    const unsubscribe = fontRegistry.subscribe((family) => {
      loadedSetRef.current.add(family);
      forceUpdateFontList((n) => n + 1);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (cachedFonts) return;

    fetchGoogleFonts()
      .then((data) => {
        setFonts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const displayedFonts = useMemo(() => fonts.slice(0, visibleCount), [fonts, visibleCount]);

  const hasMore = visibleCount < fonts.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, fonts.length));
  }, [fonts.length]);

  const loadFont = useCallback(async (family: string) => {
    if (!family || fontRegistry.isLoaded(family)) return;
    await fontRegistry.loadFont(family);
  }, []);

  const preloadProjectFonts = useCallback(async (families: string[]) => {
    await fontRegistry.preloadFonts(families);
    families.forEach((f) => loadedSetRef.current.add(f));
    forceUpdateFontList((n) => n + 1);
  }, []);

  return {
    displayedFonts,
    loading,
    error,
    hasMore,
    loadMore,
    loadFont,
    preloadProjectFonts,
    loadedSetRef,
  };
}
