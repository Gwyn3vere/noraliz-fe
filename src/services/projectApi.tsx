import api from "./api";
import type { ProjectSummary, ProjectDetail, ProjectPayload } from "@/types";

export async function fetchProjects(): Promise<ProjectSummary[]> {
  const response = await api.get("/projects");
  return response.data;
}

export async function createProject(name: string, description?: string): Promise<ProjectSummary | null> {
  const response = await api.post("/projects", { name, description });
  return response.data;
}

export async function updateProject(id: string, payload: ProjectPayload): Promise<void> {
  await api.put(`/projects/${id}`, {
    name: payload.name,
    description: payload.description,
    jsonData: payload.jsonData,
  });
}

export async function fetchProjectDetail(id: string): Promise<ProjectDetail> {
  const response = await api.get(`/projects/${id}`);
  return response.data;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`);
}
