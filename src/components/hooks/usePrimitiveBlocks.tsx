import { useState, useEffect } from "react";
import { fetchPrimitiveBlocks } from "@/services/primitiveBlockApi";
import type { PrimitiveBlock } from "@/types";

export function usePrimitiveBlocks() {
  const [blocks, setBlocks] = useState<PrimitiveBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPrimitiveBlocks();
        setBlocks(data);
      } catch (err) {
        console.error("Failed to fetch primitive blocks:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return { blocks, isLoading };
}
