import { useState, useEffect, useCallback } from "react";
import { fetchProjects, createProject, deleteProject } from "@/services/projectApi";
import type { ProjectSummary } from "@/types";

interface UseProjectsReturn {
  projects: ProjectSummary[];
  isLoading: boolean;
  error: string | null;
  createNewProject: (name: string, description?: string) => Promise<ProjectSummary | null>;
  removeProject: (id: string) => Promise<void>;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load projects.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const createNewProject = async (name: string, description?: string) => {
    try {
      const newProject = await createProject(name, description);
      if (newProject) {
        setProjects((prev) => [newProject, ...prev]);
      }
      return newProject;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create project.");
      return null;
    }
  };

  const removeProject = async (id: string) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete project.");
    }
  };

  return { projects, isLoading, error, createNewProject, removeProject };
}
