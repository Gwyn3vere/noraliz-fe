import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectDetail } from "@/services/projectApi";
import type { ProjectDetail } from "@/types";

interface UseProjectLoaderReturn {
  project: ProjectDetail | null;
  isLoading: boolean;
  error: string | null;
}

export function useProjectLoader(): UseProjectLoaderReturn {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      setError("No project ID provided.");
      return;
    }

    const loadProject = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchProjectDetail(projectId);
        setProject(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load project.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  return { project, isLoading, error };
}
