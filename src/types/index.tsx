import { TAB_MENU } from "@/constants/tabMenu";
import type { ReactNode } from "react";

export type TabMenuType = (typeof TAB_MENU)[number]["value"];

export type EmptyType = {
  icon?: string;
  title: string;
  content: string;
  button?: ReactNode;
};

export interface ProjectSummary {
  id: string;
  name: string;
  description: string | null;
  thumbnailUrl: string | null;
  updatedAt: string;
  pageCount: number;
  isPublic: boolean;
}

export interface ProjectDetail {
  id: string;
  name: string;
  description: string | null;
  jsonData: any; // Hoặc định nghĩa rõ hơn sau
  thumbnailUrl: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  pageCount: number;
}

export interface AssetSummary {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;

  name?: string;
  sizeFormatted?: string;
}

export interface UserSummary {
  id: string;
  email: string;
  fullName: string;
}
