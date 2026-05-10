import api from "./api";
import type { UserSummary } from "@/types";

export async function fetchMe(): Promise<UserSummary> {
  const response = await api.get("/users/me");

  return response.data.user;
}
