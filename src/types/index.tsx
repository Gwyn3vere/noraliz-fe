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

export interface BlockItem {
  type: string;
  label: string;
  thumbnail: string;
}

export interface MenuItem {
  id: string;
  label: string;
  badge?: string;
  thumbnail?: string;
  type?: string;
  children?: MenuItem[];
  kind?: "section" | "block";
  variant?: string;
}

export interface BlockStyles {
  [cssProperty: string]: string;
}

export interface BaseBlock {
  id: string;
  type: string;
  order: number;
  defaultClass?: string;
  classes?: string[];
  styles?: Record<string, BlockStyles>;
}

// Concrete block types
export interface TextBlock extends BaseBlock {
  type: "text";
  props: {
    content: string;
  };
}

export interface HeadingBlock extends BaseBlock {
  type: "heading";
  props: {
    styles: {};
    content: string;
    level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  };
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  props: {
    src: string;
    alt: string;
    objectFit: "cover" | "contain" | "fill" | "none";
  };
}

export interface ButtonBlock extends BaseBlock {
  type: "button";
  props: {
    label: string;
    href: string;
    variant: "primary" | "secondary" | "outline";
  };
}

export interface ColumnsBlock extends BaseBlock {
  type: "columns";
  props: {
    styles: {};
    count: 2 | 3;
    gap: string;
  };
  children: ColumnBlock[];
}

export interface ColumnBlock {
  id: string;
  type: "column";
  order: number;
  blocks: Block[];
}

// Union type cho tất cả các block
export type Block =
  | TextBlock
  | HeadingBlock
  | ImageBlock
  | ButtonBlock
  | ColumnsBlock
  | (BaseBlock & { props?: Record<string, unknown> });

export interface Section {
  id: string;
  templateId?: string | null;
  order: number;
  props?: Record<string, unknown>;
  blocks: Block[];
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  order: number;
  props?: Record<string, unknown>;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  sections: Section[];
}

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  pages: Page[];
}

export interface PrimitiveBlock {
  id: string;
  type: string;
  variant: string;
  name: string;
  description?: string;
  thumbnailUrl: string;
  category: string;
  defaultProps: Record<string, unknown>;
  schema?: unknown;
  tier: string;
}
