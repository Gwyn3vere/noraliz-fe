import api from "./api";
import type { PrimitiveBlock } from "@/types";

export async function fetchPrimitiveBlocks(): Promise<PrimitiveBlock[]> {
  const response = await api.get("/primitive-blocks");
  return response.data;
}
