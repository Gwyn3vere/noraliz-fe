import api from "./api";
import type { ProjectSummary } from "@/types";

export async function fetchProjects(): Promise<ProjectSummary[]> {
  const response = await api.get("/projects");
  return response.data;
}

export async function createProject(name: string, description?: string): Promise<ProjectSummary> {
  const response = await api.post("/projects", { name, description });
  return response.data;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`);
}
