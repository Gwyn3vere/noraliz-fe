import { useState, useEffect } from "react";
import { fetchProjectDetail } from "@/services/projectApi";
import type { ProjectDetail } from "@/types";

export function usePreviewProject(projectId: string | undefined) {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      setError("No project ID");
      return;
    }

    setIsLoading(true);
    fetchProjectDetail(projectId)
      .then((data) => {
        setProject(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load project");
        setIsLoading(false);
      });
  }, [projectId]);

  return { project, isLoading, error };
}
