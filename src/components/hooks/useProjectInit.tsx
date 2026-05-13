import { useEffect } from "react";
import { useEditorStore } from "@/stores/editorStore";
import type { ProjectDetail } from "@/types";

export function useProjectInit(project: ProjectDetail | null) {
  const setCurrentProject = useEditorStore((state) => state.setCurrentProject);

  useEffect(() => {
    if (!project) return;

    // Parse jsonData nếu nó là string
    let jsonData = project.jsonData;
    if (typeof jsonData === "string") {
      try {
        jsonData = JSON.parse(jsonData);
      } catch {
        jsonData = {};
      }
    }

    // Đảm bảo jsonData có cấu trúc pages (nếu không có thì tạo page mặc định)
    if (!jsonData.pages || !Array.isArray(jsonData.pages) || jsonData.pages.length === 0) {
      jsonData = {
        pages: [
          {
            id: crypto.randomUUID(),
            name: "Home",
            slug: "index.html",
            order: 0,
            sections: [],
          },
        ],
      };
    }

    // Đưa vào store
    setCurrentProject({
      id: project.id,
      name: project.name,
      ownerId: "",
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      pages: jsonData.pages,
    });
  }, [project, setCurrentProject]);
}
