import type { ProjectSummary } from "@/types";

export const mockProjects: ProjectSummary[] = [
  {
    id: "1",
    name: "My Portfolio",
    description: "Personal portfolio website",
    thumbnailUrl: "",
    updatedAt: "2026-05-06T10:30:00Z",
    pageCount: 3,
    isPublic: true,
  },
  {
    id: "2",
    name: "Landing Page XYZ",
    description: "Product landing page for client",
    thumbnailUrl: "",
    updatedAt: "2026-05-05T14:20:00Z",
    pageCount: 1,
    isPublic: true,
  },
  {
    id: "3",
    name: "Startup Website",
    description: "Multi-page website for a startup",
    thumbnailUrl: "",
    updatedAt: "2026-05-04T09:15:00Z",
    pageCount: 5,
    isPublic: true,
  },
];
